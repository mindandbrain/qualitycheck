import FastSet from "collections/fast-set";

import { Img } from "./dataclass/img";

import { Entity, entities } from "./record/entity";
import { Tagged } from "./types";

export class Database {
  // partial re-implementation of pipeline database

  imgsArray: Array<Img>;
  indexSets: { [key in Entity]: { [key: string]: FastSet<number> } } = {
    sub: {},
    suffix: {},
    task: {},
    ses: {},
    run: {},
    dir: {},
    type: {},
  };

  constructor() {}

  put(imgsArray: Array<Img>): void {
    this.imgsArray = imgsArray;
    for (const img of this.imgsArray) {
      for (const k of entities) {
        const v = img[k];
        const valuedict = this.indexSets[k];
        if (!(v in valuedict)) {
          valuedict[v] = new FastSet<number>();
        }
        valuedict[v].add(img.index);
      }
    }
  }

  closest(obj: Tagged, entities: Entity[]): Img {
    let set: FastSet<number> | null = null;
    for (const k of entities) {
      if (obj[k] !== null && obj[k] in this.indexSets[k]) {
        if (set === null) {
          set = this.indexSets[k][obj[k]];
        } else {
          const candidateSet = set.intersection(this.indexSets[k][obj[k]]);
          if (candidateSet.length === 0) {
            break;
          } else {
            set = candidateSet;
          }
        }
      }
    }
    if (set !== null) {
      return this.imgsArray[set.sorted()[0]];
    }
    return this.imgsArray[0]; // return default if no match
  }
}
