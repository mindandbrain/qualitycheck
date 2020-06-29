import {
  Model,
  Entity,
  SortKey,
  sortKeys,
  ImgTypeStr,
  imgTypeStrs,
  Tagged,
  Img,
  Hrefable,
  Indexed,
  Location,
  PropertiesComparator,
} from "../model";

import { TreeNode } from "./tree";

export class Item extends TreeNode<Item> implements Hrefable, Tagged, Indexed {
  entities: Array<Entity>;

  subject: string;
  task?: string;
  session?: string;
  run?: string;
  direction?: string;
  type: ImgTypeStr;

  point: HTMLElement;
  href: string;

  constructor(entities?: Array<Entity>) {
    super();
    this.entities = entities || new Array<Entity>();
  }

  get index(): number {
    return this.siblingIndex;
  }

  updateHref(sortKey: SortKey): void {
    const obj: Tagged = {};
    let item: Item = this;
    while (item !== null) {
      for (const k of item.entities) {
        if (!(k in obj)) {
          obj[k] = item[k] || null;
        }
      }
      item = item.parentNode;
    }
    this.href = Location.makeDynamicHref(obj, "infer", sortKey);

    for (const [i, childNode] of this.childNodes.entries()) {
      childNode.updateHref(sortKey);
    }
  }

  matches(img: Img): boolean {
    for (const k of this.entities) {
      if (this[k] !== img[k]) {
        return false;
      }
    }
    return true;
  }

  requireMatchingChild(img: Img, entities: Array<Entity>): Item | null {
    const lastChild = this.lastChild;
    if (lastChild === null || !lastChild.matches(img)) {
      this.appendChild(Item.from(img, entities));
    }
    return this.lastChild;
  }

  static from(img: Img, entities: Array<Entity>): Item {
    const item = new Item(entities);
    for (const k of entities) {
      item[k] = img[k] || null;
    }
    return item;
  }
}

export class NavigatorViewModel {
  items: { [key in SortKey]: Array<Item> };
  leafNodesByHash: { [key in SortKey]: { [key: string]: Item } } = {
    type: {},
    subject: {},
  };

  constructor(model: Model) {
    const byTypeImageTypeItems: Map<ImgTypeStr, Item> = new Map<ImgTypeStr, Item>();
    const bySubjectRoot: Item = new Item();
    for (const [i, img] of model.imgsArray.entries()) {
      const bySubjectSubjectItem = bySubjectRoot.requireMatchingChild(img, ["subject"]);
      const bySubjectScanItem = bySubjectSubjectItem.requireMatchingChild(img, [
        "suffix",
        "task",
        "session",
        "run",
        "direction",
        "type",
      ]);
      this.leafNodesByHash["subject"][img.hash] = bySubjectScanItem;
    }

    const imgsArrayByType = [...model.imgsArray];
    const ict = PropertiesComparator<Img>([
      "typeIndex",
      "direction",
      "run",
      "session",
      "task",
      "suffix",
      "subject",
    ]);
    imgsArrayByType.sort(ict);
    const byTypeRoot: Item = new Item();
    for (const [i, img] of imgsArrayByType.entries()) {
      const byTypeImageTypeItem = byTypeRoot.requireMatchingChild(img, ["type"]);
      const byTypeScanItem = byTypeImageTypeItem.requireMatchingChild(img, [
        "subject",
        "suffix",
        "task",
        "session",
        "run",
        "direction",
      ]);
      this.leafNodesByHash["type"][img.hash] = byTypeScanItem;
    }

    bySubjectRoot.updateSiblings();
    byTypeRoot.updateSiblings();

    bySubjectRoot.updateHref("subject");
    byTypeRoot.updateHref("type");

    this.items = {
      type: byTypeRoot.childNodes,
      subject: bySubjectRoot.childNodes,
    };
    // remove subject/type root as these are not to be displayed
    for (const sortKey of sortKeys) {
      for (const item of this.items[sortKey]) {
        item.parentNode = null;
      }
    }
  }
}
