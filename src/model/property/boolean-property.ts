import { BaseProperty } from "./base";

export class BooleanProperty extends BaseProperty<boolean> {
  protected validateString(v: string): boolean {
    return v === "true" || v === "false";
  }
  protected fromString(v: string): boolean {
    if (v === "true") {
      return true;
    } else if (v === "false") {
      return false;
    }
    throw new Error(`Invalid BooleanProperty string '${v}'`);
  }
  protected toString(v: boolean): string {
    if (v === true) {
      return "true";
    } else if (v === false) {
      return "false";
    }
  }
}
