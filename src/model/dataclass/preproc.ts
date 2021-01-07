import { Tagged } from "../types";

export class PreprocStatus implements Tagged {
  sub: string;
  task?: string;
  ses?: string;
  run?: string;
  dir?: string;

  ok: boolean;

  protected constructor(sub: string, ok: boolean) {
    this.sub = sub;
    this.ok = ok;
  }

  static async load(obj: any): Promise<PreprocStatus> {
    if (!("sub" in obj)) {
      throw new Error("PreprocStatus obj missing 'sub'");
    }
    const sub = obj["sub"];

    if (!("status" in obj)) {
      throw new Error("PreprocStatus obj missing 'status'");
    }
    const ok = obj["status"] === "done";

    const preprocStatus = new PreprocStatus(sub, ok);

    preprocStatus.task = obj["task"] || null;
    preprocStatus.ses = obj["ses"] || null;
    preprocStatus.run = obj["run"] || null;
    preprocStatus.dir = obj["dir"] || null;

    return preprocStatus;
  }
}
