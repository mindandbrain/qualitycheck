import { BaseItem, Item } from "model/item";

import { Comparator, 
        makePropertiesComparator, 
        makeArgsortComparator } from "model/comparator";

import { SortKey, SortKeyMap, 
         sortKeyToDisplayNameMap } from "model/sort-key";

// export enum SortKey {
//  Subject = "subject",
//  ImageType = "image-type"
// }
// 
// type SortKeyMap<T> = {
//   [P in SortKey]: T;
// };
// type InverseSortKeyMap = {
//   [key: string]: SortKey;
// };
// 
// function k(s: string) { // make id
//   return s.replace(/\s/g, "-").toLowerCase();
// }
// 
// const a = "Subject";
// const b = "Image type";
// const c = k(a);
// const d = k(b);
// 
// export const sortKeyToTagMap: SortKeyMap<string> = {
//   [SortKey.Subject]: c,
//   [SortKey.ImageType]: d
// };
// 
// export const tagToSortKeyMap: InverseSortKeyMap = {
//   [c]: SortKey.Subject,
//   [d]: SortKey.ImageType
// };
// 
// export const sortKeyToDisplayNameMap: SortKeyMap<string> = {
//   [SortKey.Subject]: a,
//   [SortKey.ImageType]: b
// };
// 
// export const displayNameToSortKeyMap: InverseSortKeyMap = {
//   [a]: SortKey.Subject,
//   [b]: SortKey.ImageType
// };

type ItemKey = keyof Item;
const sortKeyToItemKeysMap: SortKeyMap<ItemKey[]> = { // sort priorities
  [SortKey.Subject]: ["sub", "it", "task", "run"],
  [SortKey.ImageType]: ["it", "sub", "task", "run"]
};

type SortKeyToIndexMap = SortKeyMap<Uint16Array>;

export class ItemOrder {
  public forwardBy: SortKeyToIndexMap; // item index -> sorted index
  public backwardBy: SortKeyToIndexMap; // sorted index -> item index
  
  constructor(items: Item[]) {    
    this.forwardBy = {} as SortKeyToIndexMap; 
    this.backwardBy = {} as SortKeyToIndexMap;
    
    const n = items.length;
    
    for (let key in sortKeyToDisplayNameMap) {
      
      this.forwardBy[key] = new Uint16Array(n);
      for (let i = 0; i < n; i++) {
        this.forwardBy[key][i] = i;
      }
      
      const itemComparator: Comparator<Item> = makePropertiesComparator<Item, ItemKey>(
        sortKeyToItemKeysMap[key]
      );
      
      const comparator = makeArgsortComparator(itemComparator, items);

      this.forwardBy[key].sort(comparator);
      
      this.backwardBy[key] = new Uint16Array(n);
      for (let i = 0; i < n; i++) {
        this.backwardBy[key][this.forwardBy[key][i]] = i;
      }
      
    }
  }
}