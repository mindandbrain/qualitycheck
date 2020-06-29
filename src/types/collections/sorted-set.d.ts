declare module "collections/sorted-set" {
  import GenericSet from "collections/generic-set";
  import PropertyChanges from "collections/listen/property-changes";
  import RangeChanges from "collections/listen/range-changes";

  export = SortedSet;

  let SortedSet: SortedSetConstructor;

  interface SortedSetConstructor {
    (values?: any[]): SortedSet<any>;
    <T>(values?: T[]): SortedSet<T>;
    new (values?: any[]): SortedSet<any>;
    new <T>(values?: T[]): SortedSet<T>;
    from<T>(values?: T[]): SortedSet<T>;
  }

  interface SortedSet<T>
    extends GenericSet<T>,
      PropertyChanges<SortedSet<T>>,
      RangeChanges<T> {
    swap(): boolean;
  }
}
