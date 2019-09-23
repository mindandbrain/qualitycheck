//

import { Item } from "./item.js";

const compare = (value1, value2) => {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) {
    return 1;
  } 
  return 0;
};

export class DataStore {
  #items;
  
  #itemIndexToIndexBySubject;
  #itemIndexToIndexByImageType;
  
  #indexBySubjectToItemIndex;
  #indexByImageTypeToItemIndex;
  
  #_itemOrderBy;
  
  constructor(baseData) {
    let self = this;
    
    this.#items = baseData.map((entry) => {
      try {
        return new Item(entry, self);
      } catch {} // hidden/invalid item -> undefined
    }).filter((entry) => {
      return entry; // remove undefined
    });
    this.#items.forEach((entry, index) => {
      entry.index = index; 
    });
    
    let n = this.#items.length;
    
    this.#itemIndexToIndexBySubject = new Uint16Array(n);
    for (let i = 0; i < n; i++) {
      this.#itemIndexToIndexBySubject[i] = i;
    }
    this.#itemIndexToIndexByImageType = new Uint16Array(this.#itemIndexToIndexBySubject);
    
    // argsort
    this.#itemIndexToIndexBySubject.sort((i1, i2) => {
      const item1 = this.#items[i1], item2 = this.#items[i2];
      if (item1.subject === item2.subject) {
        if (item1.imageType === item2.imageType) {
          if (item1.task === item2.task) {
            return compare(item1.run, item2.run);
          }
          return compare(item1.task, item2.task);
        } 
        return compare(item1.imageType, item2.imageType);
      } 
      return compare(item1.subject, item2.subject);
    });
    this.#itemIndexToIndexByImageType.sort((i1, i2) => {
      const item1 = this.#items[i1], item2 = this.#items[i2];
      if (item1.imageType === item2.imageType) {
        if (item1.subject === item2.subject) {
          if (item1.task === item2.task) {
            return compare(item1.run, item2.run);
          }
          return compare(item1.task, item2.task);
        } 
        return compare(item1.subject, item2.subject);
      } 
      return compare(item1.imageType, item2.imageType);
    });
    
    // inverse argsort
    this.#indexBySubjectToItemIndex = new Uint16Array(n);
    for (let i = 0; i < n; i++) {
      this.#indexBySubjectToItemIndex[this.#itemIndexToIndexBySubject[i]] = i;
    }
    this.#indexByImageTypeToItemIndex = new Uint16Array(n);
    for (let i = 0; i < n; i++) {
      this.#indexByImageTypeToItemIndex[this.#itemIndexToIndexByImageType[i]] = i;
    }
    
  }
  
  // itemOrderBy getter and setter
  get itemOrderBy() {
    return this.#_itemOrderBy;
  }
  set itemOrderBy(by) {
    this.#_itemOrderBy = by;
    // ...
  }
  
  // persist scroll positions
  get position() {
    
  }
  set position(pos) {
    
  }
  
  // item data access
  getItemByIndex(index) {
    return this.#items[index];
  }
  previousItem(item) {
    if (this.#_itemOrderBy == "subject") {
      
    } else if (this.#_itemOrderBy == "task") {
      
    }
  }
  nextItem(item) {
    
  }
  
  // progress bars
  setRatingProgressForSubjectCallback(subject, callback) {
    
  }
  setRatingProgressForTaskCallback(task, callback) {
    
  }
  
  // localstorage utility functions
  storeByKey(key, value) {
    
  }
  getByKey(key) {
    
  }
  
  
}