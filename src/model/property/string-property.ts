import { BaseProperty } from "./base";

export class StringProperty extends BaseProperty<string> {
  protected validateString(v: string): boolean {
    return true;
  }
  protected fromString(v: string): string {
    return v;
  }
  protected toString(v: string): string {
    return v;
  }
}
