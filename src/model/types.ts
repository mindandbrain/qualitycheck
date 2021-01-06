import SortedSet from "collections/sorted-set";

import { Entity } from "./record/entity";

export type Collection<T> = SortedSet<T> | Array<T>;

export interface Indexed {
  index: number;
}

export interface Hrefable {
  href: string;
}

export type Tagged = {
  [key in Entity]?: string;
};
