import { BaseProperty } from "./base";
import { Rating, isRating } from "../record";

export class RatingProperty extends BaseProperty<Rating> {
  constructor(hash: string) {
    super(`${hash}:rating`, "none");
  }

  protected validateString(v: string): boolean {
    return isRating(v);
  }
  protected fromString(v: string): Rating {
    if (isRating(v)) {
      return v;
    }
    throw new Error(`Invalid RatingProperty string '${v}'`);
  }
  protected toString(rating: Rating): string {
    return rating as string;
  }
}
