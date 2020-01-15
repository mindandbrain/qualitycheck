import { HashBuilder } from "utils";

import { BaseItem, Item } from "model/item";

import { ItemOrder } from "model/sort";

import { SortKey, tagToSortKeyMap,
  sortKeyToTagMap, sortKeyToDisplayNameMap 
} from "model/sort-key";

import { Zoom, tagToZoomMap,
  zoomToTagMap, zoomToDisplayNameMap 
} from "model/zoom";

import { Orientation, tagToOrientationMap,
  orientationToTagMap, orientationToDisplayNameMap 
} from "model/orientation";

import { EnumProperty } from "model/property";

export class DataStore {
  private items: Item[];
  
  public itemOrder: ItemOrder;
  
  public itemsHash: string;
  
  public sortKey: EnumProperty<SortKey>;
  public zoom: EnumProperty<Zoom>;
  public orientation: EnumProperty<Orientation>;
    
  constructor(baseItems: BaseItem[]) {    
    this.items = [];
    
    let itemIdSet = new Set<string>();
    let itemHashBuilder = new HashBuilder();
    for (let i = baseItems.length - 1; i >= 0; i--) { 
      // go backwards so that newly appended items overwrite old ones
      let baseItem = baseItems[i];
      try {
        if (!itemIdSet.has(baseItem.id)) { // skip existing items
          let item = new Item(baseItem);
          
          itemHashBuilder
            .reduceString(item.id)
            .reduceString(item.fname);
            
          item.index = this.items.push(item) - 1; // save item
          
          itemIdSet.add(item.id);
        }
      } catch {} // invalid item 
    }
    this.itemsHash = itemHashBuilder.stringHash;
    
    this.itemOrder = new ItemOrder(this.items);
    
    this.sortKey = new EnumProperty<SortKey>(
      `${this.itemsHash}_sortKey`,
      SortKey.ImageType,
      tagToSortKeyMap,
      sortKeyToTagMap,
      sortKeyToDisplayNameMap
    );
    this.zoom = new EnumProperty<Zoom>(
      `${this.itemsHash}_zoom`,
      Zoom.On,
      tagToZoomMap,
      zoomToTagMap,
      zoomToDisplayNameMap
    );
    this.orientation = new EnumProperty<Orientation>(
      `${this.itemsHash}_orientation`,
      Orientation.Horizontal,
      tagToOrientationMap,
      orientationToTagMap,
      orientationToDisplayNameMap
    );
    
  }
  
}