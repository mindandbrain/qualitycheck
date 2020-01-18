import { Attribute, h, t } from "view/render";

import { Orientation } from "view/base";
import { Container, SentinelObservingContainer } from "view/container";

import { DataStore } from "model/data-store";
import { SortKey } from "model/sort-key";

export class MultiScrollBarView extends Container {
  public subjectScrollBarView: ScrollBarView;
  public imageTypeScrollBarView: ScrollBarView;
  public taskScrollBarView: ScrollBarView;
  
  constructor(parent: HTMLElement, dataStore: DataStore) {
    super(parent);
    
    this.container = h("div", [], []);
    
    this.subjectScrollBarView = new ScrollBarView(this.container);
    this.imageTypeScrollBarView = new ScrollBarView(this.container);
    this.taskScrollBarView = new ScrollBarView(this.container);
    
    const appendChildren = () => {
      parent.appendChild(this.container);
      
      let v: SortKey = dataStore.sortKey.get();
      // if (v === SortKey.Subject) {
      //   this.container.appendChild(this.subjectScrollBarView);
      //   this.container.appendChild(this.imageTypeScrollBarView);
      // } else if (v === SortKey.ImageType) {
      //   this.container.appendChild(this.imageTypeScrollBarView);
      //   this.container.appendChild(this.subjectScrollBarView);
      // }
      // this.container.appendChild(this.taskScrollBarView);
    };

    this.queue.push(appendChildren);
    
    dataStore.sortKey.listen(this.onSortKeyChange.bind(this));
  }
  
  public onSortKeyChange(v: SortKey) {
    if (v === SortKey.Subject) {
      // this.container.removeChild(this.subjectScrollBarView);
      // this.container.insertBefore(this.subjectScrollBarView, this.imageTypeScrollBarView);
    } else if (v === SortKey.ImageType) {
      // this.container.removeChild(this.imageTypeScrollBarView);
      // this.container.insertBefore(this.imageTypeScrollBarView, this.subjectScrollBarView);
    }
  }
  
}

export class ScrollBarView extends SentinelObservingContainer {
  constructor(parent: HTMLElement) {
    super(parent, Orientation.Vertical);
    
    
  }
  
  public addElementFront(): void {
    throw new Error("Method not implemented.");
  }
  
  public addElementBack(): void {
    throw new Error("Method not implemented.");
  }
}