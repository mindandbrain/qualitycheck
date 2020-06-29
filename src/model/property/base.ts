import { TypedCallback, StringCallback } from "./callback";

export interface Property<T> {
  get(): T;
  set(v: T): void;
  reset(): void;
  listen(v: TypedCallback<T>): void;
  unlisten(v: TypedCallback<T>): void;
}

export abstract class BaseProperty<T> implements Property<T> {
  propertyName: string;
  defaultValue: T;

  private typedCallbacks: TypedCallback<T>[] = [];

  protected abstract validateString(v: string): boolean;
  protected abstract toString(v: T): string;
  protected abstract fromString(v: string): T;

  constructor(propertyName: string, defaultValue: T) {
    this.propertyName = propertyName;
    this.defaultValue = defaultValue;
  }

  private getString(): string {
    let val = localStorage.getItem(this.propertyName);
    if (val === null) {
      this.setString(this.toString(this.defaultValue));
      return this.getString();
    } else {
      return val;
    }
  }
  private setString(v: string) {
    if (!this.validateString(v)) {
      throw new Error(`Invalid value for property '${this.propertyName}'`);
    }
    localStorage.setItem(this.propertyName, v);
  }

  get(): T {
    return this.fromString(this.getString());
  }
  set(v: T) {
    const s = this.toString(v);
    if (s !== this.getString()) {
      this.setString(s);
      for (const cb of this.typedCallbacks) {
        cb(v);
      }
    }
  }

  listen(cb: TypedCallback<T>): void {
    this.typedCallbacks.unshift(cb);
    cb(this.get());
  }
  unlisten(cb: TypedCallback<T>): void {
    const i = this.typedCallbacks.indexOf(cb);
    if (i === -1) {
      throw new Error("Callback not found");
    }
    this.typedCallbacks.splice(i, 1);
  }
  reset(): void {
    this.set(this.defaultValue);
  }
}
