import { Location } from "./location";
import {
  ImgType,
  ImgTypeStr,
  imgTypeSuffixes,
  Suffix,
  relatedImgsImgTypes,
  strImgTypes,
  imgTypeStrs,
} from "../record";
import { keyPath } from "../key-path";
import { Indexed } from "../types";

export class Img implements Indexed {
  index: number;

  subject: string;
  task?: string;
  session?: string;
  run?: string;
  direction?: string;
  type: ImgTypeStr;
  typeIndex: ImgType;

  suffix: Suffix;

  path: string;
  hash: string;
  sourceFiles: string[];

  href: string;

  protected constructor(
    subject: string,
    type: ImgTypeStr,
    path: string,
    hash: string,
    sourceFiles: string[]
  ) {
    this.subject = subject;
    this.type = type;
    this.typeIndex = strImgTypes[type];
    this.suffix = imgTypeSuffixes[this.typeIndex];
    this.path = path;
    this.hash = hash;
    this.sourceFiles = sourceFiles;

    const loc = new Location("explore");
    loc.sortKey = "subject";
    loc.hash = hash;
    this.href = loc.toFragmentIdentifier();
  }

  get keyPath(): string {
    return keyPath(
      this.subject,
      this.task,
      this.session,
      this.run,
      this.direction,
      this.type
    );
  }

  static relatedImgsMap: Map<string, Array<string>> = new Map();
  get relatedImgs() {
    return Img.relatedImgsMap.get(this.keyPath);
  }

  static async load(obj): Promise<Img | null> {
    if (!("subject" in obj)) {
      throw new Error("Val obj missing 'subject'");
    }
    const subject = obj["subject"];
    const task = obj["task"] || null;
    const session = obj["session"] || null;
    const run = obj["run"] || null;
    const direction = obj["direction"] || null;
    if (!("desc" in obj)) {
      throw new Error("Img obj missing 'desc'");
    }
    const desc = obj["desc"];
    if (!("path" in obj)) {
      throw new Error("Img obj missing 'path'");
    }
    const path = obj["path"];
    if (!(desc in strImgTypes)) {
      if (!(desc in relatedImgsImgTypes)) {
        throw new Error(`Img obj has unknown 'desc' value '${desc}'`);
      }
      const type = relatedImgsImgTypes[desc];
      const keyp = keyPath(subject, task, session, run, direction, imgTypeStrs[type]);
      if (!this.relatedImgsMap.has(keyp)) {
        this.relatedImgsMap.set(keyp, new Array<string>());
      }
      this.relatedImgsMap.get(keyp).push(path);
      return null;
    }
    const type = desc;
    if (!("hash" in obj)) {
      throw new Error("Img obj missing 'hash'");
    }
    const hash = obj["hash"];
    const sourceFiles = obj["sourcefiles"] || [];
    const img = new Img(subject, type, path, hash, sourceFiles);
    img.task = task;
    img.session = session;
    img.run = run;
    img.direction = direction;
    return img;
  }
}
