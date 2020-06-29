import { ViewModel } from "../view-model";
import { Location, LocationProperty, ViewType } from "../model";

import { Sidebar } from "./sidebar";
import { Explore } from "./explore";
import { Charts } from "./charts";
import { Zoom } from "./zoom";

export class App extends HTMLElement {
  static define(): void {
    customElements.define("qc-app", this);
  }

  sidebar: Sidebar;
  explore: Explore;
  zoom: Zoom;
  charts: Charts;

  viewModel: ViewModel;
  viewType: ViewType | null = null;
  locationProperty: LocationProperty;

  constructor(viewModel: ViewModel) {
    super();

    this.viewModel = viewModel;

    this.sidebar = new Sidebar(viewModel);
    this.appendChild(this.sidebar);
    this.explore = new Explore(viewModel);
    this.zoom = new Zoom(viewModel);
    this.charts = new Charts(viewModel);

    this.locationProperty = this.viewModel.model.locationProperty;
    this.viewType = this.locationProperty.get().viewType;
    if (this.viewType == "charts") {
      this.appendChild(this.charts);
    } else if (this.viewType == "explore") {
      this.appendChild(this.explore);
    } else if (this.viewType == "zoom") {
      this.appendChild(this.zoom);
    }
    this.locationProperty.listen(this.onLocationChange.bind(this));

    window.addEventListener("click", this.onClick);
    window.addEventListener("hashchange", this.onHashChange);
    window.addEventListener("popstate", this.onHashChange);
    document.addEventListener("keydown", this.onKeyDown);
  }

  navigateToFragmentIdentifier = (fi: string): void => {
    const fragmentIdentifier = this.locationProperty
      .get()
      .resolveDynamicHref(fi, this.viewModel.model);
    const loc = Location.fromFragmentIdentifier(fragmentIdentifier);
    if (loc.viewType !== this.viewType) {
      history.pushState(null, "", fragmentIdentifier);
    } else {
      history.replaceState(null, "", fragmentIdentifier);
    }
    this.locationProperty.set(loc);
  };
  onKeyDown = (event: KeyboardEvent): void => {
    const loc = this.locationProperty.get();
    let fragmentIdentifier = null;
    if (event.key === "a" || event.key === "A" || event.keyCode === 37) {
      // previous
      if (loc.hash && loc.sortKey) {
        const item = this.viewModel.navigatorViewModel.leafNodesByHash[loc.sortKey][loc.hash];
        if (item && item.previousSibling) {
          fragmentIdentifier = item.previousSibling.href;
        }
      }
    } else if (event.key === "d" || event.key === "D" || event.keyCode === 39) {
      // next
      if (loc.hash && loc.sortKey) {
        const item = this.viewModel.navigatorViewModel.leafNodesByHash[loc.sortKey][loc.hash];
        if (item && item.nextSibling) {
          fragmentIdentifier = item.nextSibling.href;
        }
      }
    } else if (event.key === "w" || event.key === "W") {
      if (loc.hash) {
        this.viewModel.model.ratingPropertiesByHash.get(loc.hash).set("good");
      }
    } else if (event.key === "s" || event.key === "S") {
      if (loc.hash) {
        this.viewModel.model.ratingPropertiesByHash.get(loc.hash).set("uncertain");
      }
    } else if (event.key === "x" || event.key === "X") {
      if (loc.hash) {
        this.viewModel.model.ratingPropertiesByHash.get(loc.hash).set("bad");
      }
    } else if (event.key === "q" || event.key === "Q" || event.keyCode === 27) {
      // esc
      if (loc.hash && loc.viewType == "zoom") {
        loc.viewType = "explore";
        fragmentIdentifier = loc.toFragmentIdentifier();
      }
    }
    if (fragmentIdentifier) {
      this.navigateToFragmentIdentifier(fragmentIdentifier);
    }
  };
  onHashChange = (): void => {
    const fragmentIdentifier = this.locationProperty
      .get()
      .resolveDynamicHref(location.hash, this.viewModel.model);
    const loc = Location.fromFragmentIdentifier(fragmentIdentifier);
    this.locationProperty.set(loc);
  };
  onClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const match = target.closest("a") as HTMLAnchorElement;

    if (!match) {
      return; // is not an anchor
    }

    if (
      match.host === location.host &&
      match.pathname === location.pathname &&
      match.hash !== location.hash
    ) {
      this.navigateToFragmentIdentifier(match.hash);
      event.preventDefault();
    }
  };
  onLocationChange = (loc: Location): void => {
    if (loc.hash && !(loc.hash in this.viewModel.model.imgsByHash)) {
      this.navigateToFragmentIdentifier(Location.default().toFragmentIdentifier());
      return;
    }
    history.replaceState(null, "", loc.toFragmentIdentifier());
    if (loc.viewType !== this.viewType) {
      // remove old
      if (this.viewType === "charts") {
        this.removeChild(this.charts);
      } else if (this.viewType === "explore") {
        this.removeChild(this.explore);
      } else if (this.viewType === "zoom") {
        this.removeChild(this.zoom);
      }
      this.viewType = loc.viewType;
      // add new
      if (this.viewType === "charts") {
        this.appendChild(this.charts);
      } else if (this.viewType === "explore") {
        this.appendChild(this.explore);
      } else if (this.viewType === "zoom") {
        this.appendChild(this.zoom);
      }
    }
    this.sidebar.onLocationChange(loc);
    this.explore.onLocationChange(loc);
    this.zoom.onLocationChange(loc);
    this.charts.onLocationChange(loc);
  };
}
App.define();
