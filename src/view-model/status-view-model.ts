import { Model, Status, Location, Tagged } from "../model";

export class StatusEntry implements Tagged {
  index: number;

  sub: string;

  status: Status;
  href: string;

  constructor(sub: string, status: Status, href: string) {
    this.sub = sub;
    this.status = status;
    this.href = href;
  }
}

export class StatusViewModel {
  entries: Map<string, StatusEntry> = new Map<string, StatusEntry>();
  entriesArray: Array<StatusEntry> = new Array<StatusEntry>();

  entrySets: { [key in Status]: Array<number> } = {
    unknown: new Array<number>(),
    pending: new Array<number>(),
    running: new Array<number>(),
    success: new Array<number>(),
    error: new Array<number>(),
  };

  constructor(model: Model) {
    let sub: string | null = null;
    for (const [i, img] of Object.entries(model.imgsArray)) {
      if (sub !== img.sub) {
        sub = img.sub;
        const loc = new Location("explore");
        loc.sortKey = "sub";
        loc.hash = img.hash;
        const href = loc.toFragmentIdentifier();
        let status = model.subjectWorkflowStatuses.has(sub)
          ? model.subjectWorkflowStatuses.get(sub).status
          : "unknown";
        if (sub in model.preprocStatuses) {
          const subjectPreprocStatuses = model.preprocStatuses[sub];
          if (subjectPreprocStatuses.every((status) => status.ok)) {
            if (status === "running") {
              status = "success";
            }
          }
        }
        const obj = new StatusEntry(sub, status, href);
        this.entries.set(sub, obj);
        this.entriesArray.push(obj);
      }
    }
    for (const [i, entry] of this.entriesArray.entries()) {
      entry.index = i;
      this.entrySets[entry.status].push(entry.index);
    }
  }
}
