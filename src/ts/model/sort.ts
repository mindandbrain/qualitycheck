import { Item } from "model/item";

import { Comparator, 
        makePropertiesComparator, 
        makeArgsortComparator } from "model/comparator";

import { SortKey, SortKeyMap, 
         sortKeyToDisplayNameMap } from "model/sort-key";

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