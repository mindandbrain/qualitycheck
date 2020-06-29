import { valTypes, ValType, imgTypeStrs, valTypeImgTypes } from "../record";
import { keyPath } from "../key-path";
import { Tagged, Indexed } from "../types";

export class Val implements Tagged, Indexed {
  index: number;

  subject: string;
  task: string;
  session?: string;
  run?: string;
  direction?: string;

  type: ValType;
  number: number;

  href: string;

  protected constructor(subject: string, task: string, type: ValType, number: number) {
    this.subject = subject;
    this.task = task;
    this.type = type;
    this.number = number;
  }

  get keyPath(): string {
    return keyPath(
      this.subject,
      this.task,
      this.session || null,
      this.run || null,
      this.direction || null,
      imgTypeStrs[valTypeImgTypes[this.type]]
    );
  }

  static *load(obj): IterableIterator<Val> {
    if (!("subject" in obj)) {
      return;
      // throw new Error("Val obj missing 'subject'");
    }
    const subject = obj["subject"];
    if (!("task" in obj)) {
      return;
      // throw new Error("Val obj missing 'task'");
    }
    const task = obj["task"];
    for (const type of valTypes) {
      if (type in obj) {
        const val = new Val(subject, task, type, obj[type]);
        if ("session" in obj) {
          val.session = obj["session"];
        }
        if ("run" in obj) {
          val.run = obj["run"];
        }
        if ("direction" in obj) {
          val.direction = obj["direction"];
        }
        yield val;
      }
    }
  }
}
