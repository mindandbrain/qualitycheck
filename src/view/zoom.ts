import { ViewModel } from "../view-model";
import { Location, Img, SortKey, entities } from "../model";

import { RatingButtonGroup } from "./rating";
import { PointFactory } from "./point";
import { Attribute, h, t } from "./render";

export class Zoom extends HTMLElement {
  static define(): void {
    customElements.define("qc-zoom", this);
  }

  viewModel: ViewModel;

  imgsByHash: { [key: string]: Img };
  pointsByHash: { [key: string]: HTMLElement } = {};

  imgElement: HTMLImageElement;

  pointContainer: HTMLElement;
  ratingButtonGroup: RatingButtonGroup;

  sortKey: SortKey | null = null;

  constructor(viewModel: ViewModel) {
    super();

    this.viewModel = viewModel;

    this.imgsByHash = viewModel.model.imgsByHash;

    const factory = new PointFactory([...entities]);
    for (const img of Object.values(this.imgsByHash)) {
      this.pointsByHash[img.hash] = factory.create(img);
      this.pointsByHash[img.hash].classList.add("active");
    }

    this.imgElement = h("img", [], []) as HTMLImageElement;
    this.imgElement.addEventListener("click", () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "q" }));
    });
    this.appendChild(h("div", [new Attribute("class", "container")], [this.imgElement]));

    const closeButton = h("li", [new Attribute("class", "button close")], []);
    closeButton.addEventListener("click", () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "q" }));
    });

    this.pointContainer = h("div", [], []);

    this.ratingButtonGroup = new RatingButtonGroup(viewModel);

    const previousButton = h("button", [new Attribute("class", "button previous")], []);
    previousButton.addEventListener("click", () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    const nextButton = h("button", [new Attribute("class", "button next")], []);
    nextButton.addEventListener("click", () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    });

    const nav = h(
      "nav",
      [],
      [
        h(
          "ul",
          [],
          [
            closeButton,
            h("li", [new Attribute("class", "points")], [this.pointContainer]),
            h("li", [new Attribute("class", "buttons")], [this.ratingButtonGroup]),
            h("li", [new Attribute("class", "buttons")], [previousButton, nextButton]),
          ]
        ),
      ]
    );

    this.appendChild(nav);

    this.imgElement.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        window.requestAnimationFrame(() => {
          const boundingClientRect = this.getBoundingClientRect();
          const padding = 0.2;
          const x0 = boundingClientRect.width * padding;
          let x1 =
            ((event.clientX - boundingClientRect.left - x0) /
              (boundingClientRect.width - 2 * x0)) *
            100;
          const y0 = boundingClientRect.height * padding;
          let y1 =
            ((event.clientY - boundingClientRect.top - y0) /
              (boundingClientRect.height - 2 * y0)) *
            100;
          if (x1 < 0) {
            x1 = 0;
          } else if (x1 > 100) {
            x1 = 100;
          }
          if (y1 < 0) {
            y1 = 0;
          } else if (y1 > 100) {
            y1 = 100;
          }
          this.imgElement.style.objectPosition = `${x1}% ${y1}%`;
        });
      },
      false
    );
  }

  onLocationChange(loc: Location): void {
    if (loc.hash in this.imgsByHash) {
      this.imgElement.src = this.imgsByHash[loc.hash].path;
      this.ratingButtonGroup.onHashChange(loc.hash);
      if (this.pointContainer.hasChildNodes()) {
        this.pointContainer.removeChild(this.pointContainer.firstChild);
      }
      this.pointContainer.appendChild(this.pointsByHash[loc.hash]);
    } else {
      // TODO show some kind of error
    }
  }
}
Zoom.define();
