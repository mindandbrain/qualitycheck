import { BaseProperty } from "./base";

import { utf8Decoder } from "../utils";

export class FloatProperty extends BaseProperty<number> {
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
  protected toString(v: number): string {
    let buffer: ArrayBuffer = new ArrayBuffer(8);
    let u8View: Uint8Array = new Uint8Array(buffer);
    let f64View: Float64Array = new Float64Array(buffer);

    f64View[0] = v;
    const bt = utf8Decoder.decode(u8View);
    const st = window.btoa(bt); // base64 encode
    return st;
  }
}
