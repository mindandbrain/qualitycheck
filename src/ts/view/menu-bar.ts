import { ViewBase } from "view/base";
import MenuBarTemplate from "view/template/menu-bar";

import { SegmentedControlView, Option } from "view/segmented-control";

import { sortKeyToIdMap, 
  sortKeyToDisplayNameMap } from "model/order";
import { DataStore } from "model/data-store";

export class MenuBarView extends MenuBarTemplate {
  public sortBySegmentedControl: SegmentedControlView;
  
  private children: ViewBase[] = [];
  
  constructor(parent: HTMLElement, dataStore: DataStore) {
    super(parent);
    
    let options: Option[] = [];
    for (let key in sortKeyToIdMap) {
      options.push(new Option(
        sortKeyToIdMap[key],
        sortKeyToDisplayNameMap[key]
      ));
    }
    
    this.sortBySegmentedControl = new SegmentedControlView(
      this.sortByContainer,
      options,
      dataStore.getSortKeyId.bind(dataStore),
      dataStore.setSortKeyId.bind(dataStore),
      dataStore.listenSortKeyId.bind(dataStore)
    );
    this.children.unshift(this.sortBySegmentedControl);
  }
  
  loop() {
    super.loop();
    
    for (let child of this.children) {
      child.loop();
    }
  }
}
