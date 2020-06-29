import SortedSet from "collections/sorted-set";
import { format } from "d3-format";

import {
  Entity,
  entityDisplayNames,
  entityColors,
  Collection,
  Indexed,
  Tagged,
  Hrefable,
} from "../../model";

import { Attribute, h, t } from "../render";
import { PointFactory } from "../point";
import { percent, px } from "../utils";

import pluralize from "pluralize";

export class MosaicPlot<
  T extends Indexed & Hrefable & Tagged,
  K extends keyof T & string,
  P extends T[K] & string
> extends HTMLElement {
  static define(): void {
    customElements.define("qc-mosaic-plot", this);
  }

  objs: Array<T>;
  sets: { [key in P]: Collection<number> };

  points: Array<HTMLElement>;
  blocks: Array<HTMLElement> = new Array<HTMLElement>();

  constructor(
    entities: Array<keyof T & Entity>,
    objs: Array<T>,
    sets: { [key in P]: Collection<number> }, // disjoint
    displayNames: { [key in P]: string },
    colors: { [key in P]: string },
    noun: string
  ) {
    super();

    this.sets = sets;
    this.objs = objs;

    const factory = new PointFactory(entities);
    this.points = this.objs.map((entry) => factory.create(entry));

    for (const [key, set] of Object.entries<Collection<number>>(sets)) {
      const displayName = displayNames[key];
      const color = colors[key];

      let pointsInSet: Array<HTMLElement>;
      if (set instanceof SortedSet) {
        pointsInSet = set.map((i) => this.points[i]);
      } else {
        pointsInSet = set.map((i) => this.points[i]);
      }

      const pointsContainer = h("div", [new Attribute("class", "container")], pointsInSet);

      const infoElement = h("span", [new Attribute("class", "info")], []);

      const block = h(
        "div",
        [new Attribute("class", `block ${color}`)],
        [
          h(
            "header",
            [],
            [h("span", [new Attribute("class", `caption`)], [t(displayName)]), infoElement]
          ),
          pointsContainer,
        ]
      );

      const f = format(".0%");
      const layout = (length: number): void => {
        const proportion = length / this.objs.length;
        const percentStr = f(proportion);
        // block.style.flexGrow = proportion.toString();
        const inflected = pluralize(noun, length);
        if (percentStr !== "0%") {
          infoElement.textContent = `${length} ${inflected} (${percentStr})`;
        } else {
          infoElement.textContent = `${length} ${inflected}`;
        }
      };
      layout(set.length);
      this.blocks.push(block);

      if (set instanceof SortedSet) {
        set.addOwnPropertyChangeListener("length", layout);
        set.addRangeChangeListener(
          (plus: Array<number>, minus: Array<number>, at: number): void => {
            for (const i of minus) {
              // do nothing, because block.add call
              // will automatically remove element from old
              // location when moving via insertBefore
            }
            for (const i of plus) {
              if (at < pointsContainer.children.length) {
                pointsContainer.insertBefore(this.points[i], pointsContainer.children[at]);
              } else {
                pointsContainer.appendChild(this.points[i]);
              }
            }
          }
        );
      }
    }

    const container = h("div", [new Attribute("class", "container")], [...this.blocks]);
    this.appendChild(container);
  }
}
MosaicPlot.define();
