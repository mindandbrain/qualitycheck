import { BaseItem, Item } from "./item";

import { Comparator, 
        makePropertiesComparator, 
        makeArgsortComparator } from "./comparator";

export const enum SortKey {
 Subject,
 ImageType
}

type SortKeyMap<T> = {
  [P in SortKey]: T;
};
type InverseSortKeyMap = {
  [key: string]: SortKey;
};
type ItemKey = keyof Item;

function k(s: string) { // make id
  return s.replace(/\s/g, "-").toLowerCase();
}

const a = "Subject";
const b = "Image type";
const c = k(a);
const d = k(b);

export const sortKeyToIdMap: SortKeyMap<string> = {
  [SortKey.Subject]: c,
  [SortKey.ImageType]: d
};

export const idToSortKeyMap: InverseSortKeyMap = {
  [c]: SortKey.Subject,
  [d]: SortKey.ImageType
};

export const sortKeyToDisplayNameMap: SortKeyMap<string> = {
  [SortKey.Subject]: a,
  [SortKey.ImageType]: b
};

export const displayNameToSortKeyMap: InverseSortKeyMap = {
  [a]: SortKey.Subject,
  [b]: SortKey.ImageType
};

const sortKeyToItemKeysMap: SortKeyMap<ItemKey[]> = { // sort priorities
  [SortKey.Subject]: ["sub", "it", "task", "run"],
  [SortKey.ImageType]: ["it", "sub", "task", "run"]
};

type SortKeyToIndexMap = SortKeyMap<Uint16Array>;

export class ItemOrder {
  public forward: SortKeyToIndexMap; // item index -> sorted index
  public backward: SortKeyToIndexMap; // sorted index -> item index
  
  constructor(items: Item[]) {    
    this.forward = {} as SortKeyToIndexMap; 
    this.backward = {} as SortKeyToIndexMap;
    
    const n = items.length;
    
    for (let key in sortKeyToDisplayNameMap) {
      
      this.forward[key] = new Uint16Array(n);
      for (let i = 0; i < n; i++) {
        this.forward[key][i] = i;
      }
      
      const itemComparator: Comparator<Item> = makePropertiesComparator<Item, ItemKey>(
        sortKeyToItemKeysMap[key]
      );
      
      const comparator = makeArgsortComparator(itemComparator, items);

      this.forward[key].sort(comparator);
      
      this.backward[key] = new Uint16Array(n);
      for (let i = 0; i < n; i++) {
        this.backward[key][this.forward[key][i]] = i;
      }
      
    }
  }
}