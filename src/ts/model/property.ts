import { TypedCallback, 
         StringCallback } from "model/callback";
import { Item } from "model/item";
import { DataStore } from "model/data-store";

import { utf8Decoder } from "utils";

export abstract class AbstractProperty<T> {
  public propertyName: string;
  
  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }
  
  public abstract get(): T;
  public abstract set(v: T): void;
  public abstract listen(v: TypedCallback<T>): void;
}

export abstract class Property<T> extends AbstractProperty<T> {
  private stringCallbacks: StringCallback[] = [];
  
  protected abstract validateString(v: string): boolean;
  protected abstract toString(v: T): string;
  protected abstract fromString(v: string): T;
  
  public getString(): string {
    return window.localStorage.getItem(this.propertyName) || "";
  }
  
  public setString(v: string) {
    if (!this.validateString(v)) {
      throw new Error(`Unknown value for property '${this.propertyName}'`);
    }
    window.localStorage.setItem(this.propertyName, v);
    for (let callback of this.stringCallbacks) {
      callback(v);
    }  
  }
  
  public get(): T {
    return this.fromString(this.getString());
  }
  public set(v: T) {
    this.setString(this.toString(v));
  }
  
  public listen(cb: TypedCallback<T>) {
    let scb = (v: string) => {
      cb(this.fromString(v));
    };
    this.listenString(scb);
  }
  public listenString(cb: StringCallback) {
    this.stringCallbacks.unshift(cb);
  }  
}

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