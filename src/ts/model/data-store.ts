import { HashBuilder } from "utils";

import { BaseItem, Item } from "./item";

import { SortKey, ItemOrder,
  sortKeyToIdMap, idToSortKeyMap
} from "./order";

type SortKeyCallback = (sk: SortKey) => void;
// type OrientationCallback = (o: Orientation) => void;

export class DataStore {
  private items: Item[];
  
  public itemOrder: ItemOrder;
  
  private itemHashBuilder = new HashBuilder();
  public itemsHash: string;
  
  constructor(baseItems: BaseItem[]) {    
    this.items = [];
    
    let itemIdSet = new Set<string>();
    for (let i = baseItems.length - 1; i >= 0; i--) { 
      // go backwards so that newer items overwrite old ones
      let baseItem = baseItems[i];
      try {
        if (!itemIdSet.has(baseItem.id)) {
          let item = new Item(baseItem);
          
          this.itemHashBuilder
            .reduceString(item.id)
            .reduceString(item.fname);
            
          item.index = this.items.push(item) - 1;
          
          itemIdSet.add(baseItem.id);
        }
      } catch {} // invalid item 
    }
    
    this.itemsHash = this.itemHashBuilder.stringHash;
    console.log(this.itemsHash);
    
    this.sortKey = SortKey.ImageType;
    
    this.itemOrder = new ItemOrder(this.items);
    console.log(this.itemOrder);
    
  }
  
  private sortKey: SortKey;
  private sortKeyCallbacks: SortKeyCallback[] = [];
  public getSortKey(): SortKey {
    return this.sortKey;
  }
  public setSortKey(sk: SortKey) {
    console.log(`setSortKey ${sk}`);
    this.sortKey = sk;
    for (let callback of this.sortKeyCallbacks) {
      callback(sk);
    }
  }
  public listenSortKey(callback: SortKeyCallback) {
    this.sortKeyCallbacks.unshift(callback);
  }
  
  public getSortKeyId(): string {
    return sortKeyToIdMap[this.sortKey];
  }
  public setSortKeyId(id: string) {
    this.setSortKey(idToSortKeyMap[id]);
  }
  public listenSortKeyId(callback: (value: string) => void) {
    this.listenSortKey((sk: SortKey) => {
      callback(sortKeyToIdMap[sk]);
    });
  }
  
  // private orientation: Orientation;
  // private orientationCallbacks: OrientationCallback[] = [];
  // public getOrientation(): Orientation {
  //   return this.orientation;
  // }
  // public setOrientation(o: Orientation) {
  //   console.log(`setOrientation ${o}`);
  //   this.orientation = sk;
  //   for (let callback of this.sortKeyCallbacks) {
  //     callback(sk);
  //   }
  // }
  // public listenSortKey(callback: SortKeyCallback) {
  //   this.sortKeyCallbacks.unshift(callback);
  // }
  // 
  // public getSortKeyId(): string {
  //   return sortKeyToIdMap[this.sortKey];
  // }
  // public setSortKeyId(id: string) {
  //   this.setSortKey(idToSortKeyMap[id]);
  // }
  // public listenSortKeyId(callback: (value: string) => void) {
  //   this.listenSortKey((sk: SortKey) => {
  //     callback(sortKeyToIdMap[sk]);
  //   });
  // }
  
  
}