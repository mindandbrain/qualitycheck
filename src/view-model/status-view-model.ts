import { Model, Status, Location } from "../model";

export class StatusEntry {
  index: number;

  subject: string;
  status: Status;
  href: string;

  constructor(subject: string, status: Status, href: string) {
    this.subject = subject;
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
    let subject: string | null = null;
    for (const [i, img] of Object.entries(model.imgsArray)) {
      if (subject !== img.subject) {
        subject = img.subject;
        const loc = new Location("explore");
        loc.sortKey = "subject";
        loc.hash = img.hash;
        const href = loc.toFragmentIdentifier();
        const status = model.subjectWorkflowStatuses.has(subject)
          ? model.subjectWorkflowStatuses.get(subject).status
          : "unknown";
        const subjectObj = new StatusEntry(subject, status, href);
        this.entries.set(subject, subjectObj);
        this.entriesArray.push(subjectObj);
      }
    }
    for (const [i, entry] of this.entriesArray.entries()) {
      entry.index = i;
      this.entrySets[entry.status].push(entry.index);
    }
  }
}
