import {
  Entity,
  Tagged,
  entityDisplayNames,
  entityColors,
  Hrefable,
  imgTypeStrDisplayNames,
  suffixDisplayNames,
  Indexed,
} from "../model";

import { Attribute, h, t } from "./render";

export class PointFactory<T extends Hrefable & Tagged & Indexed> {
  readonly entities: Array<Entity>;
  constructor(entities: Array<Entity>) {
    this.entities = entities;
  }

  create(obj: T, entities?: Array<Entity>) {
    if (!entities) {
      entities = this.entities;
    }
    const entries: Array<HTMLElement> = new Array<HTMLElement>();

    // normal case, show all tags
    for (const k of entities) {
      if (obj[k] !== undefined && obj[k] !== null) {
        if (k === "suffix") {
          if (obj[k] === "func") {
            continue;
          } else if (obj[k] === "anat") {
            entries.push(
              h(
                "li",
                [new Attribute("class", "anat")],
                [
                  h(
                    "span",
                    [new Attribute("class", "value")],
                    [t(suffixDisplayNames[obj["suffix"]])]
                  ),
                ]
              )
            );
          }
        } else if (k === "type") {
          entries.push(
            h(
              "li",
              [new Attribute("class", "type")],
              [
                h(
                  "span",
                  [new Attribute("class", "value")],
                  [t(imgTypeStrDisplayNames[obj.type])]
                ),
              ]
            )
          );
        } else {
          entries.push(
            h(
              "li",
              [new Attribute("class", entityColors[k])],
              [
                h("span", [new Attribute("class", "tagname")], [t(entityDisplayNames[k])]),
                h("span", [new Attribute("class", "value")], [t(obj[k])]),
              ]
            )
          );
        }
      }
    }
    const point = h(
      "a",
      [new Attribute("class", "point"), new Attribute("href", obj.href)],
      [h("ul", [new Attribute("class", "entries")], entries)]
    );
    point.dataset.index = obj.index.toString();
    // point.dataset.nEntries = entries.length.toString();
    return point;
  }
}
