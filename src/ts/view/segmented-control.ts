import { Attribute, h, t } from "view/render";
import { ViewBase, Orientation } from "view/base";

import { HashBuilder } from "utils";

import { EnumProperty } from "model/property";

export class Option {
  public id: string;
  public displayName: string;
  
  constructor(id: string, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }
}

export class SegmentedControlView extends ViewBase {
  public property: EnumProperty<unknown>;
  
  public htmlElementMap: { [key: string]: HTMLElement } = {};
  
  private isDirty: boolean = false;
    
  constructor(parent: HTMLElement, property: EnumProperty<unknown>) {
    super(parent);
    
    this.property = property;
    
    let values = property.possibleValues();
    
    const hashBuilder = new HashBuilder();
    for (let value of values) {
      hashBuilder
        .reduceString(value.id)
        .reduceString(value.displayString);
    }
      console.log(hashBuilder);
    const name = hashBuilder.stringHash;    
    
    const id = property.getString();
    
    for (let value of values) {
      
      const inputElement = h("input", [
        new Attribute("type", "radio"),
        new Attribute("name", name),
        new Attribute("id", value.id)
      ], []);
      
      if (id === value.id) {
        inputElement.setAttribute("checked", "");
      }
      
      const eventListener = (event) => {
        this.isDirty = true;
        property.setString(event.target.id);
        this.isDirty = false;
      };
      inputElement.addEventListener("change", 
        eventListener.bind(this));
      
      this.htmlElementMap[value.id] = inputElement;
    }
    
    const appendChildren = () => {
      for (let value of values) {
        parent.appendChild(this.htmlElementMap[value.id]);
        parent.appendChild(h("label", [
          new Attribute("for", value.id)
        ], [
          t(value.displayString)
        ]));
      }
    };
    
    this.queue.push(appendChildren);
  }
  
  public loop() {
    super.loop();
  }
}