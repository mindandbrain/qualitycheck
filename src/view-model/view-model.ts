import { Model } from "../model";

import { StatusViewModel } from "./status-view-model";
import { NavigatorViewModel } from "./navigator-view-model";
import { RatingsViewModel } from "./ratings-view-model";
import { ValViewModel } from "./val-view-model";

export class ViewModel {
  model: Model;
  statusViewModel: StatusViewModel;
  navigatorViewModel: NavigatorViewModel;
  ratingsViewModel: RatingsViewModel;
  valViewModel: ValViewModel;

  constructor(model: Model) {
    this.model = model;
    this.navigatorViewModel = new NavigatorViewModel(model);
    this.statusViewModel = new StatusViewModel(model);
    this.ratingsViewModel = new RatingsViewModel(model);
    this.valViewModel = new ValViewModel(model);
  }
}
