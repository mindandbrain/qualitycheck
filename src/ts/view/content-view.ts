import { DataStore } from "model/data-store";
import { ViewBase } from "view/base";
import { MenuBarView } from "./menu-bar";

export class ContentView extends ViewBase {
  private menuBar: MenuBarView;
  
  private children: ViewBase[] = [];
  
  private dataStore: DataStore;
  
  constructor(dataStore: DataStore) {
    super(document.body);
    
    this.dataStore = dataStore;
    
    this.menuBar = new MenuBarView(this.parent, this.dataStore);
    this.children.unshift(this.menuBar);
    
    this.raf();
  }
  
  private raf() {
    window.requestAnimationFrame(this.loop.bind(this));
  }
  
  public loop() {
    for (let child of this.children) {
      child.loop();
    }
    
    this.raf();
  }
}
