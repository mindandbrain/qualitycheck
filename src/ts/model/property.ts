import { TypedCallback, 
         StringCallback } from "model/callback";

export abstract class Property<T> {
  public propertyName: string;
  
  private stringCallbacks: StringCallback[] = [];
  
  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }
  
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
