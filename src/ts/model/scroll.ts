import { FloatProperty, 
         ItemProperty,
         AbstractProperty } from "model/property";
import { TypedCallback } from "model/callback";
import { DataStore } from "model/data-store";
                  
export class ScrollPosition {
  public itemId: string;
  public subItemPosition: number;
  
  constructor(itemId: string, subItemPosition: number) {
    this.itemId = itemId;
    this.subItemPosition = subItemPosition;
  }
}

export class ScrollPositionProperty extends AbstractProperty<ScrollPosition> {
  private itemProperty: ItemProperty;
  private subItemPositionProperty: FloatProperty;
  
  private callbacks: TypedCallback<ScrollPosition>[] = [];
  
  constructor(propertyName: string, dataStore: DataStore) {
    super(propertyName);
    
    this.itemProperty = new ItemProperty(`${propertyName}_item`, dataStore);
    this.subItemPositionProperty = new FloatProperty(`${propertyName}_subItem`);
  }
  
  public get(): ScrollPosition {
    return new ScrollPosition(
      this.itemProperty.getString(),
      this.subItemPositionProperty.get()
    );
  }
  public set(v: ScrollPosition): void {
    this.itemProperty.setString(v.itemId);
    this.subItemPositionProperty.set(v.subItemPosition);
    for (let callback of this.callbacks) {
      callback(v);
    } 
  }
  public listen(cb: TypedCallback<ScrollPosition>): void {
    this.callbacks.unshift(cb);
  }
}