export const compareStrings = (a: string, b: string): number => {
  return a.localeCompare(b, undefined, {
    sensitivity: "base",
    ignorePunctuation: true
  });
};

export const compare = (a: any, b: any): number => {
  if (typeof a === "string" && typeof b === "string") {
    return compareStrings(a, b);
  } else if (a === b || (a == null && b == null)) {
    return 0;
  } else if (b != null && (a == null || a > b)) {
    return 1;
  } else {
    return -1;
  }
};

export interface Comparator<T> {
    (a: T, b: T): number;
}

export function makeStringComparator(): Comparator<string> {
  return compareStrings;
}

export function makePropertyComparator<T, K extends keyof T>(key: K): Comparator<T> {
  return (a: T, b: T) => {
    return compare(a[this.key], b[this.key]);
  };
}

export function makePropertiesComparator<T, K extends keyof T>(keys: K[]): Comparator<T> {
  return (a: T, b: T) => {
    let r = 0;
    for (let key of keys) {
      r = compare(a[key], b[key]);
      if (r !== 0) {
        break;
      }
    }
    return r;
  };
}

export function makeArgsortComparator<T>(comparator: Comparator<T>, values: T[]): Comparator<number> {
  return (a: number, b: number) => {
    return comparator(values[a], values[b]);
  };
}