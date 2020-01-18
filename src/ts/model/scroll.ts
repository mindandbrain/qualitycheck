import { Item } from "model/item";
import { DataStore } from "model/data-store";
import { Property } from "model/property";
         
const utf8Decoder = new TextDecoder("utf8");

export class FloatProperty extends Property<number> {
  protected validateString(v: string): boolean {
    try {
      this.fromString(v);
      return true;
    } catch {}
    return false;
  }
  protected fromString(v: string): number {
    let buffer: ArrayBuffer = new ArrayBuffer(8);
    let u8View: Uint8Array = new Uint8Array(buffer);
    let f64View: Float64Array = new Float64Array(buffer);
    
    const bytes = window.atob(v); // base64 decode
    for (let i = 0; i < u8View.length; i++) {
      u8View[i] = bytes.charCodeAt(i); 
    }
    
    return f64View[0];
  }
  protected toString(v: number):string {
    let buffer: ArrayBuffer = new ArrayBuffer(8);
    let u8View: Uint8Array = new Uint8Array(buffer);
    let f64View: Float64Array = new Float64Array(buffer);
    
    f64View[0] = v;
    const bt = utf8Decoder.decode(u8View);
    const st = window.btoa(bt); // base64 encode
    return st;
  }
}

export class ItemProperty extends Property<Item> {
  private dataStore: DataStore;
  
  constructor(propertyName: string, dataStore: DataStore) {
    super(propertyName);
    
    this.dataStore = dataStore;
  }
  
  protected validateString(v: string): boolean {
    return this.dataStore.hasItemById(v); 
  }  
  protected toString(v: Item): string {
    return v.id;
  }
  protected fromString(v: string): Item {
    return this.dataStore.getItemById(v);
  }
}


export class ScrollPositionProperty {
  
  
  
}