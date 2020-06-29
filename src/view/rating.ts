import { ViewModel } from "../view-model";
import { Rating, ratings, ratingDisplayNames, RatingProperty } from "../model";

import { Attribute, h, t } from "./render";

const ratingsForButtons: Rating[] = ["good", "uncertain", "bad"];

export class RatingButtonGroup extends HTMLElement {
  static define(): void {
    customElements.define("qc-rating-buttons", this);
  }

  viewModel: ViewModel;
  ratingPropertiesByHash: Map<string, RatingProperty>;

  hash: string | null = null;

  ratingButton: { [key in Rating]?: HTMLElement } = {};

  constructor(viewModel: ViewModel) {
    super();

    this.viewModel = viewModel;
    this.ratingPropertiesByHash = viewModel.model.ratingPropertiesByHash;

    this.classList.add("buttons");

    for (const rating of ratingsForButtons) {
      this.ratingButton[rating] = h(
        "button",
        [new Attribute("class", `button ${rating}`)],
        [] // t(ratingDisplayNames[rating])
      );
      this.ratingButton[rating].addEventListener("click", () => {
        if (this.ratingProperty.get() === rating) {
          this.ratingProperty.set("none");
        } else {
          this.ratingProperty.set(rating);
        }
      });
      this.appendChild(this.ratingButton[rating]);
    }
  }

  get ratingProperty(): RatingProperty {
    return this.ratingPropertiesByHash.get(this.hash);
  }

  onRatingChange = (rating: Rating): void => {
    for (const r of ratingsForButtons) {
      if (r === rating) {
        this.ratingButton[r].classList.add("active");
      } else {
        this.ratingButton[r].classList.remove("active");
      }
    }
  };

  onHashChange(hash: string): void {
    if (this.ratingProperty) {
      this.ratingProperty.unlisten(this.onRatingChange);
    }
    this.hash = hash;
    if (this.ratingProperty) {
      this.ratingProperty.listen(this.onRatingChange);
    }
  }
}
RatingButtonGroup.define();
