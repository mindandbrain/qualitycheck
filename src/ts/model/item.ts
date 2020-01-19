import { ImageType, 
  tagToImageTypeMap, imageTypeToTagMap, imageTypeToDisplayNameMap } from "model/image-type";

export declare interface BaseItem {
  id: string;
  fname: string;
  sources: string[];
}

export class BaseItem {
  public id: string;
  public fname: string;
  public sources: string[];
  
  constructor(id: string, fname: string, sources: string[]) { // validate fields
    if (!id) {
      throw new Error("BaseItem missing 'id'");
    }
    if (!fname) {
      throw new Error("BaseItem missing 'fname'");
    }
    if (!sources) {
      sources = [];
    }
    
    this.id = id;
    this.fname = fname;
    this.sources = sources;
  }
}

const subPrefix: string = "sub_";
const taskPrefix: string = "task_";
const runPrefix: string = "run-";

export class Item extends BaseItem {
  public index: number = -1;

  public sub?: string;
  public task?: string;
  public run?: string;
  
  public it: ImageType;
  
  constructor(base: BaseItem) {
    super(base.id, base.fname, base.sources); // validate
        
    const parts: string[] = this.id.split(".");
    
    let tag = "";
    
    for (let part of parts) {
      if (part.startsWith(subPrefix)) {
        this.sub = part.substr(subPrefix.length);
      } else if (part.startsWith(taskPrefix)) {
        this.task = part.substr(taskPrefix.length);
      } else if (part.startsWith(runPrefix)) {
        this.run = part.substr(runPrefix.length);
      } else {
        if (tag.length !== 0) {
          tag += ".";
        }
        tag += part;
      }
    }
    
    if (!this.sub) {
      throw new Error("Item missing 'sub'");
    }
    
    this.it = tagToImageTypeMap[tag]; // imageType is index
    if (!this.it) {
      throw new Error("Item missing 'imageType'");
    }
  }
  
  get imageTypeDisplayName() {
    return imageTypeToDisplayNameMap[this.it];
  } 
  get imageTypeTag() {
    return imageTypeToTagMap[this.it];
  } 
  
}
