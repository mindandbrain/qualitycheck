import { Model } from "../model/model";
import { Tagged } from "../model/types";
import { Status } from "../model/record/status";
import { Location } from "../model/dataclass/location";

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
    pending: new Array<number>(),
    success: new Array<number>(),
    error: new Array<number>(),
  };

  constructor(model: Model) {
    let sub: string | null = null;

    for (const img of model.imgsArray) {
      if (sub !== img.sub) {

        sub = img.sub;
        const loc = new Location("explore");
        loc.sortKey = "sub";
        loc.hash = img.hash;
        const href = loc.toFragmentIdentifier();

        let status: Status = "pending";
        if (model.subjectWorkflowStatuses.has(sub)) {
          status = model.subjectWorkflowStatuses.get(sub).status;
        }

        if (sub in model.preprocStatuses) {
          const subjectPreprocStatuses = model.preprocStatuses[sub];
          if (subjectPreprocStatuses.every((status) => status.ok)) {
            if (status !== "error") {
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
