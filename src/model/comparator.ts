export interface Comparator<T> {
  (a: T, b: T): number;
}

export const StringComparator = (): Comparator<string> => {
  return (a: string, b: string): number => {
    return a.localeCompare(b, undefined, {
      sensitivity: "base",
      ignorePunctuation: true,
    });
  };
};

export const BaseComparator = (): Comparator<any> => {
  const sc = StringComparator();
  return (a: any, b: any): number => {
    if (typeof a === "string" && typeof b === "string") {
      return sc(a, b);
    } else if (a === b || (a == null && b == null)) {
      return 0;
    } else if (b != null && (a == null || a > b)) {
      return 1;
    } else {
      return -1;
    }
  };
};

export const PropertyComparator = <T>(key: keyof T): Comparator<T> => {
  const bc = BaseComparator();
  return (a: T, b: T) => {
    return bc(a[key], b[key]);
  };
};

export const PropertiesComparator = <T>(keys: readonly (keyof T)[]): Comparator<T> => {
  const bc = BaseComparator();
  return (a: T, b: T) => {
    let r = 0;
    for (let key of keys) {
      r = bc(a[key], b[key]);
      if (r !== 0) {
        break;
      }
    }
    return r;
  };
};

export const ArgsortComparator = <T>(
  comparator: Comparator<T>,
  values: T[]
): Comparator<number> => {
  return (a: number, b: number) => {
    return comparator(values[a], values[b]);
  };
};
