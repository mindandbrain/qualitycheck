import { Attribute, h, t } from "view/render";
import { ViewBase, Orientation } from "view/base";

import { HashBuilder } from "utils";

export class Option {
  public id: string;
  public displayName: string;
  
  constructor(id: string, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }
}

export class SegmentedControlView extends ViewBase {
  public options: Option[];
  
  public htmlElementMap: { [key: string]: HTMLElement } = {};
  
  private isDirty: boolean = false;
    
  constructor(parent: HTMLElement, options: Option[],
      getValue: () => string, 
      setValue: (string) => void, 
      listenValue: (Function) => void
    ) {
    super(parent);
    
    this.options = options;
    
    const hashBuilder = new HashBuilder();
    for (let option of options) {
      hashBuilder
        .reduceString(option.id)
        .reduceString(option.displayName);
    }
    const name = hashBuilder.stringHash;
    
    const value = getValue();
    
    
    for (let option of this.options) {
      
      const inputElement = h("input", [
        new Attribute("type", "radio"),
        new Attribute("name", name),
        new Attribute("id", option.id)
      ], []);
      
      if (value === option.id) {
        inputElement.setAttribute("checked", "");
      }
      
      const eventListener = (event) => {
        this.isDirty = true;
        setValue(event.target.id);
        this.isDirty = false;
      };
      inputElement.addEventListener("change", 
        eventListener.bind(this));
      
      this.htmlElementMap[option.id] = inputElement;
    }
    
    const appendChildren = () => {
      for (let option of options) {
        parent.appendChild(this.htmlElementMap[option.id]);
        parent.appendChild(h("label", [
          new Attribute("for", option.id)
        ], [
          t(option.displayName)
        ]));
      }
    };
    
    this.queue.push(appendChildren);
  }
  
  public updateValue(newValue: string) {
    if (!this.isDirty) {
      for (let option of this.options) {
        const id = option.id;
        if (id === newValue) {
          this.htmlElementMap[id].setAttribute("checked", "");
        }
      }
    }
  }
  
  public loop() {
    super.loop();
  }
}