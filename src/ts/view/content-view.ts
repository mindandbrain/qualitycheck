import { DataStore } from "model/data-store";
import { ViewBase } from "view/base";
import { MenuBarView } from "view/menu-bar";
import { MultiScrollBarView } from "view/scroll-bar";

export class ContentView extends ViewBase {
  private menuBar: MenuBarView;
  private scrollBar: MultiScrollBarView;
  
  private children: ViewBase[] = [];
  
  private dataStore: DataStore;
  
  constructor(dataStore: DataStore) {
    super(document.body);
    
    this.dataStore = dataStore;
    
    this.menuBar = new MenuBarView(this.parent, this.dataStore);
    this.children.unshift(this.menuBar);
    
    this.scrollBar = new MultiScrollBarView(this.parent, this.dataStore);
    this.children.unshift(this.scrollBar);
    
    this.requestAnimationFrame();
  }
  
  private requestAnimationFrame() {
    window.requestAnimationFrame(this.loop.bind(this));
  }
  
  public loop() {
    for (let child of this.children) {
      child.loop();
    }
    
    this.requestAnimationFrame();
  }
}
