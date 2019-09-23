import { imageTypes } from "./image-types.js";

const tagToImageTypeIndexMap = imageTypes.reduce((accumulator, currentValue, index) => {
  accumulator[currentValue.tag] = index;
  return accumulator;
}, {});

export class Item {
  index = -1;

  id;
  fname;
  sources;
  
  subject = "";
  task = "";
  run = "";
  
  tag = "";
  imageType;
  
  #model;
  
  constructor(object, model) {
    if (!"id" in object) {
      throw new Error("Item needs to have field \"id.\"");
    }
    this.id = object.id;
    
    if (!"fname" in object) {
      throw new Error("Item needs to have field \"fname.\"");
    }
    this.fname = object.fname;
    
    this.sources = object.sources || [];
    
    const parts = this.id.split(".");
    
    let subject = parts.find(part => part.startsWith("sub_"));
    if (subject) {
      this.subject = subject.replace(/^sub_/, "");
    } else {
      throw new Error("Item field \"id\" needs to contain \"sub_\" information.");
    }
    
    let task = parts.find(part => part.startsWith("task_"));
    if (task) {
      this.task = task.replace(/^task_/, "");
    } 
    
    let run = parts.find(part => part.startsWith("run-"));
    if (run) {
      this.run = run.replace(/^run-/, "");
    }
    
    let tag = parts.filter(part => !part.startsWith("sub_") &&
        !part.startsWith("task_") && !part.startsWith("run-")).join(".");
    if (tag in tagToTypeIndexMap) {
      this.tag = tag;
      this.imageType = tagToImageTypeIndexMap[tag]; // imageType is index
    } else {
      throw new Error("Item has unknown type.");
    }
    
    this.#model = model;
  }
  
  get imageTypeName() {
    return imageTypes[this.imageType].name;
  } 
  
  get rating() {
    
  }
  set rating(newState) {
    
  }
  
}
