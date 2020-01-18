import { Property } from "model/property";

export class EnumDisplayValue {
  public id: string;
  public displayString: string;
  
  constructor(id: string, displayString: string) {
    this.id = id;
    this.displayString = displayString;
  }
}

type EnumToStringMap = {
  [key: number]: string;
};
type StringToEnumMap<E> = {
  [key: string]: E;
};

export class EnumProperty<E extends number> extends Property<E> {
  private stringToEnumMap: StringToEnumMap<E>;
  private enumToStringMap: EnumToStringMap;
  private enumToDisplayStringMap: EnumToStringMap;
  
  constructor(propertyName: string, defaultValue: E,
    stringToEnumMap: StringToEnumMap<E>,
    enumToStringMap: EnumToStringMap,
    enumToDisplayStringMap: EnumToStringMap) {
    super(propertyName);
      
    this.stringToEnumMap = stringToEnumMap;
    this.enumToStringMap = enumToStringMap;
    this.enumToDisplayStringMap = enumToDisplayStringMap;
    
    if (this.getString() === "") {
      this.set(defaultValue);
    }
  }
  
  protected validateString(v: string): boolean {
    return this.stringToEnumMap.hasOwnProperty(v);
  }
  protected toString(v: E): string {
    return this.enumToStringMap[v];
  }
  protected fromString(v: string): E {
    return this.stringToEnumMap[v];
  }
  
  public possibleValues(): EnumDisplayValue[] {
    let values: EnumDisplayValue[] = [];
    for (let i in this.enumToStringMap) {
      values.push(new EnumDisplayValue(
        this.enumToStringMap[i],
        this.enumToDisplayStringMap[i]
      ));
    }
    return values;
  }
}
