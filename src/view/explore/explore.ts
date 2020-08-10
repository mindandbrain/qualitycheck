import { ViewModel } from "../../view-model";
import { Location, Img, SortKey, entities } from "../../model";

import { Navigator } from "./navigator";
import { RatingButtonGroup } from "../rating";
import { Attribute, h, t } from "../render";
import { PointFactory } from "../point";

export class Explore extends HTMLElement {
  static define(): void {
    customElements.define("qc-explorer", this);
  }

  viewModel: ViewModel;

  imgsByHash: { [key: string]: Img };
  pointsByHash: { [key: string]: HTMLElement } = {};

  pointContainer: HTMLElement;
  sourceFilesContainer: HTMLElement;
  relatedImgsContainer: HTMLElement;
  imgElement: HTMLImageElement;
  ratingButtonGroup: RatingButtonGroup;

  sortKey: SortKey | null = null;

  byTypeNavigator: Navigator;
  bySubjectNavigator: Navigator;

  constructor(viewModel: ViewModel) {
    super();

    this.viewModel = viewModel;

    this.imgsByHash = viewModel.model.imgsByHash;

    const factory = new PointFactory([...entities]);
    for (const img of Object.values(this.imgsByHash)) {
      this.pointsByHash[img.hash] = factory.create(img);
      this.pointsByHash[img.hash].classList.add("active");
    }
    this.ratingButtonGroup = new RatingButtonGroup(viewModel);
    this.imgElement = h("img", [], []) as HTMLImageElement;

    this.pointContainer = h("div", [new Attribute("class", "points")], []);
    this.sourceFilesContainer = h("ul", [], []);
    const sourceFilesElement = h(
      "div",
      [new Attribute("class", "extra")],
      [h("span", [], [t("Source files")]), this.sourceFilesContainer]
    );
    this.relatedImgsContainer = h("ul", [], []);
    const relatedImgsElement = h(
      "div",
      [new Attribute("class", "extra")],
      [h("span", [], [t("Related images")]), this.relatedImgsContainer]
    );

    const preview = h(
      "div",
      [new Attribute("class", "preview")],
      [
        h(
          "a",
          [
            new Attribute("class", "zoom"),
            new Attribute("href", Location.makeDynamicHref({}, "zoom")),
          ],
          [h("span", [], [t("Click to zoom")]), this.imgElement]
        ),
      ]
    );

    this.appendChild(
      h(
        "div",
        [new Attribute("class", "container")],
        [
          this.pointContainer,
          this.ratingButtonGroup,
          h(
            "div",
            [new Attribute("class", "extras")],
            [relatedImgsElement, sourceFilesElement]
          ),
          preview,
        ]
      )
    );

    this.byTypeNavigator = new Navigator(
      this.viewModel.navigatorViewModel.items.type,
      this.viewModel.navigatorViewModel.leafNodesByHash.type
    );
    this.bySubjectNavigator = new Navigator(
      this.viewModel.navigatorViewModel.items.sub,
      this.viewModel.navigatorViewModel.leafNodesByHash.sub
    );
  }

  clearChildren = (elem: HTMLElement): void => {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  };
  updateExtraInfo = (img: Img): void => {
    this.clearChildren(this.sourceFilesContainer);
    this.clearChildren(this.relatedImgsContainer);
    for (const sourceFile of img.sourceFiles) {
      this.sourceFilesContainer.appendChild(
        h("a", [new Attribute("href", sourceFile)], [t(sourceFile)])
      );
    }
    if (!img.relatedImgs) {
      return;
    }
    for (const relatedImg of img.relatedImgs) {
      var match = relatedImg.match(/^(?:.+?)([^\/]+)$/);
      this.relatedImgsContainer.appendChild(
        h(
          "a",
          [new Attribute("href", relatedImg), new Attribute("target", "_blank")],
          [t(match[1])]
        )
      );
    }
  };

  onLocationChange(loc: Location): void {
    if (loc.hash in this.imgsByHash) {
      this.imgElement.src = this.imgsByHash[loc.hash].path;
      this.updateExtraInfo(this.imgsByHash[loc.hash]);
      this.ratingButtonGroup.onHashChange(loc.hash);
      this.clearChildren(this.pointContainer);
      this.pointContainer.appendChild(this.pointsByHash[loc.hash]);
    } else {
      // TODO show some kind of error
    }

    if (loc.sortKey !== this.sortKey) {
      if (this.sortKey === null) {
        if (loc.sortKey === "type") {
          this.insertBefore(this.byTypeNavigator, this.firstChild);
        } else if (loc.sortKey === "sub") {
          this.insertBefore(this.bySubjectNavigator, this.firstChild);
        }
      } else {
        if (loc.sortKey === "type") {
          this.replaceChild(this.byTypeNavigator, this.bySubjectNavigator);
        } else if (loc.sortKey === "sub") {
          this.replaceChild(this.bySubjectNavigator, this.byTypeNavigator);
        } else {
          this.removeChild(this.firstChild);
        }
      }
      this.sortKey = loc.sortKey;
    }
    if (this.sortKey === "type") {
      this.byTypeNavigator.onLocationChange(loc);
    } else if (this.sortKey === "sub") {
      this.bySubjectNavigator.onLocationChange(loc);
    }
  }
}
Explore.define();
