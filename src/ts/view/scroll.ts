import { ScrollPosition,
  ScrollPositionProperty
} from "model/scroll";

import { DataStore } from "model/data-store";

export class ScrollListener {
  private scrollPosition: ScrollPositionProperty;
  
  constructor(el: HTMLElement, dataStore: DataStore) {
    this.scrollPosition = dataStore.scrollPosition;
    
    el.addEventListener("wheel", this.onWheel.bind(this), {
      passive: true
    });
    
  }
  
  private onWheel(e: Event) {
    console.log(e);
  }
  
}