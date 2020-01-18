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

import { EnumProperty } from "model/enum";

import { ScrollPositionProperty } from "model/scroll";

export class DataStore {
  public id: string;
  
  private itemIdToIndex: Map<string, number>;
  public items: Item[];
  
  public itemOrder: ItemOrder;
  
  public sortKey: EnumProperty<SortKey>;
  public zoom: EnumProperty<Zoom>;
  public orientation: EnumProperty<Orientation>;
  public scrollPosition: ScrollPositionProperty;
    
  constructor(id: string, baseItems: BaseItem[]) {    
    this.id = id;
    
    this.items = [];
    this.itemIdToIndex = new Map();
    
    for (let i = baseItems.length - 1; i >= 0; i--) { 
      // go backwards so that newly appended items overwrite old ones
      let baseItem = baseItems[i];
      try {
        if (!this.hasItemById(baseItem.id)) { // skip existing items
          let item = new Item(baseItem);
          
          item.index = this.items.push(item) - 1; // save item
          
          this.itemIdToIndex.set(item.id, item.index);
        }
      } catch {} // skip invalid item 
    }
    
    this.itemOrder = new ItemOrder(this.items);
    
    this.sortKey = new EnumProperty<SortKey>(
      `${this.id}_sortKey`,
      SortKey.ImageType,
      tagToSortKeyMap,
      sortKeyToTagMap,
      sortKeyToDisplayNameMap
    );
    this.zoom = new EnumProperty<Zoom>(
      `${this.id}_zoom`,
      Zoom.On,
      tagToZoomMap,
      zoomToTagMap,
      zoomToDisplayNameMap
    );
    this.orientation = new EnumProperty<Orientation>(
      `${this.id}_orientation`,
      Orientation.Horizontal,
      tagToOrientationMap,
      orientationToTagMap,
      orientationToDisplayNameMap
    );
    this.scrollPosition = new ScrollPositionProperty(
      `${this.id}_scrollPosition`,
      this
    );
  }
  
  public hasItemById(id: string): boolean {
    return this.itemIdToIndex.has(id);
  }
  
  public getItemById(id: string): Item {
    return this.items[this.itemIdToIndex[id]];
  }
  
}