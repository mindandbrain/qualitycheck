type StringCallback = (v: string) => void;

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

export class EnumProperty<E> {
  private propertyName: string;
  
  private idToEnumMap;
  private enumToIdMap;
  private enumToDisplayStringMap;
  
  private callbacks: StringCallback[] = [];
  
  constructor(propertyName: string, defaultValue: E,
    idToEnumMap,
    enumToIdMap,
    enumToDisplayStringMap) {
      
    this.propertyName = propertyName;
    this.idToEnumMap = idToEnumMap;
    this.enumToIdMap = enumToIdMap;
    this.enumToDisplayStringMap = enumToDisplayStringMap;
    
    if (this.getString() === "") {
      this.set(defaultValue);
    }
  }
  
  public get(): E {
    return this.idToEnumMap[this.getString()];
  }
  
  public getString(): string {
    return window.localStorage.getItem(this.propertyName) || "";
  }
  
  public set(v: E) {
    this.setString(this.enumToIdMap[v]);
  }
  
  public setString(v: string) {
    if (!this.idToEnumMap.hasOwnProperty(v)) {
      throw new Error(`Unknown value for property '${this.propertyName}'`);
    }
    window.localStorage.setItem(this.propertyName, v);
    for (let callback of this.callbacks) {
      callback(v);
    }
  }
  
  public listenString(cb: StringCallback) {
    this.callbacks.unshift(cb);
  }
  
  public possibleValues(): EnumDisplayValue[] {
    let values: EnumDisplayValue[] = [];
    for (let i in this.enumToIdMap) {
      values.push(new EnumDisplayValue(
        this.enumToIdMap[i],
        this.enumToDisplayStringMap[i]
      ));
    }
    return values;
  }
}
