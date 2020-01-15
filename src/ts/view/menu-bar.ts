import { ViewBase } from "view/base";
import MenuBarTemplate from "view/template/menu-bar";

import { SegmentedControlView } from "view/segmented-control";

import { DataStore } from "model/data-store";

export class MenuBarView extends MenuBarTemplate {
  public sortBySegmentedControl: SegmentedControlView;
  public zoomSegmentedControl: SegmentedControlView;
  public orientationSegmentedControl: SegmentedControlView;
  
  private children: ViewBase[] = [];
  
  constructor(parent: HTMLElement, dataStore: DataStore) {
    super(parent);
    
    this.sortBySegmentedControl = new SegmentedControlView(
      this.sortByContainer,
      dataStore.sortKey
    );
    this.zoomSegmentedControl = new SegmentedControlView(
      this.toggleZoomContainer,
      dataStore.zoom
    );
    this.orientationSegmentedControl = new SegmentedControlView(
      this.orientationContainer,
      dataStore.orientation
    );
    
    this.children.unshift(this.sortBySegmentedControl);
    this.children.unshift(this.zoomSegmentedControl);
    this.children.unshift(this.orientationSegmentedControl);
  }
  
  loop() {
    super.loop();
    
    for (let child of this.children) {
      child.loop();
    }
  }
}
