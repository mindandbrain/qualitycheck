import { BaseProperty } from "./base";

import { Location } from "../dataclass";

export class LocationProperty extends BaseProperty<Location> {
  constructor() {
    super("location", Location.default());
  }

  protected validateString(v: string): boolean {
    return Location.validateFragmentIdentifier(v);
  }
  protected fromString(v: string): Location {
    return Location.fromFragmentIdentifier(v);
  }
  protected toString(loc: Location): string {
    return loc.toFragmentIdentifier();
  }
}
