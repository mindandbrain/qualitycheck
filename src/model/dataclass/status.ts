import { keyPath } from "../key-path";
import { Status, statusIndices, reportExecStrStatuses } from "../record";

export class PreprocStatus {
  subject: string;
  task?: string;
  session?: string;
  run?: string;
  direction?: string;

  ok: boolean;

  protected constructor(subject: string, ok: boolean) {
    this.subject = subject;
    this.ok = ok;
  }

  get keyPath(): string {
    return keyPath(this.subject, this.task, this.session, this.run, this.direction);
  }

  static async load(obj): Promise<PreprocStatus> {
    if (!("subject" in obj)) {
      throw new Error("PreprocStatus obj missing 'subject'");
    }
    const subject = obj["subject"];

    if (!("status" in obj)) {
      throw new Error("PreprocStatus obj missing 'status'");
    }
    const ok = obj["status"] === "done";

    const preprocStatus = new PreprocStatus(subject, ok);

    preprocStatus.task = obj["task"] || null;
    preprocStatus.session = obj["session"] || null;
    preprocStatus.run = obj["run"] || null;
    preprocStatus.direction = obj["direction"] || null;

    return preprocStatus;
  }
}

const subjectCapturingRegex = /^subject_(?<subject>.+)$/;

export class Node {
  name: string;
  status: Status;

  constructor(name: string, status: Status) {
    this.name = name;
    this.status = status;
  }
}

export class Workflow {
  name: string;
  children: Map<string, Node | Workflow> = new Map<string, Node | Workflow>();

  constructor(name: string) {
    this.name = name;
  }

  has(key: string): boolean {
    return this.children.has(key);
  }
  get(key: string): Node | Workflow {
    return this.children.get(key);
  }
  set(key: string, value: Node | Workflow): void {
    this.children.set(key, value);
  }
}

export class SubjectWorkflowStatus extends Workflow {
  status: Status = "unknown";

  constructor(subject: string) {
    super(subject);
  }

  get subject() {
    return this.name;
  }

  static async load(obj): Promise<Map<string, SubjectWorkflowStatus>> {
    const subjectWorkflowStatusMap: Map<string, SubjectWorkflowStatus> = new Map();
    for (const [fullname, reportStatus] of Object.entries(obj)) {
      if (typeof fullname !== "string") {
        throw new Error(`SubjectWorkflowStatus obj entry has invalid fullname '${fullname}'`);
      }
      if (typeof reportStatus !== "string" || !(reportStatus in reportExecStrStatuses)) {
        throw new Error(
          `SubjectWorkflowStatus obj entry has invalid status '${reportStatus}'`
        );
      }
      const parts: string[] = fullname.split(".");
      let part = parts.shift();
      if (part !== "nipype") {
        throw new Error(
          `SubjectWorkflowStatus obj entry has unexpected global workflow name '${part}'`
        );
      }
      part = parts.shift();
      if (part !== "subjectlevel") {
        continue; // ignore group level
      }
      part = parts.shift();
      const found = part.match(subjectCapturingRegex);
      if (found === null) {
        throw new Error(
          `SubjectWorkflowStatus obj entry has unexpected subject workflow name '${part}'`
        );
      }
      const subject: string = found.groups.subject;
      if (!subjectWorkflowStatusMap.has(subject)) {
        subjectWorkflowStatusMap.set(subject, new SubjectWorkflowStatus(subject));
      }
      const subjectWorkflowStatus: SubjectWorkflowStatus = subjectWorkflowStatusMap.get(
        subject
      );
      let workflow: Workflow = subjectWorkflowStatus;
      while (parts.length > 1) {
        const workflowname = parts.shift();
        if (!workflow.has(workflowname)) {
          workflow.set(workflowname, new Workflow(workflowname));
        }
        const child = workflow.get(workflowname);
        if (!(child instanceof Workflow)) {
          throw new Error(
            `SubjectWorkflowStatus obj entry '${fullname}' parent is not a workflow`
          );
        } else {
          workflow = child;
        }
      }
      const nodename: string = parts.shift();
      if (workflow.has(nodename)) {
        throw new Error(`SubjectWorkflowStatus obj entry '${fullname}' is a duplicate`);
      }
      const status = reportExecStrStatuses[reportStatus];
      if (statusIndices[status] > statusIndices[subjectWorkflowStatus.status]) {
        subjectWorkflowStatus.status = status;
      }
      const node = new Node(nodename, status);
      workflow.set(nodename, node);
    }
    return subjectWorkflowStatusMap;
  }
}
