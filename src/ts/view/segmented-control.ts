import { Attribute, h, t } from "view/render";
import { ViewBase } from "view/base";

import { HashBuilder } from "utils";

import { EnumProperty } from "model/enum";

export class Option {
  public id: string;
  public displayName: string;
  
  constructor(id: string, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }
}

export class SegmentedControlView extends ViewBase {
  public property: EnumProperty<number>;
  
  public htmlElementMap: { [key: string]: HTMLElement } = {};

  constructor(parent: HTMLElement, property: EnumProperty<number>) {
    super(parent);
    
    this.property = property;
    
    let values = property.possibleValues();
    
    const hashBuilder = new HashBuilder();
    hashBuilder.reduceString(property.propertyName); 
    for (let value of values) {
      hashBuilder
        .reduceString(value.id)
        .reduceString(value.displayString);
    }
    const propertyHash = hashBuilder.stringHash;
    
    const id = property.getString();
    
    for (let value of values) {
      
      const inputElement = h("input", [
        new Attribute("type", "radio"),
        new Attribute("name", propertyHash),
        new Attribute("id", `${propertyHash}_${value.id}`) // id to assign label, use prefix to avoid conflicts
      ], []);
      
      if (id === value.id) {
        inputElement.setAttribute("checked", "");
      }
      
      const eventListener = () => {
        property.setString(
          value.id 
        );
      };
      inputElement.addEventListener("change", 
        eventListener.bind(this));
      
      this.htmlElementMap[value.id] = inputElement;
    }
    
    const appendChildren = () => {
      for (let value of values) {
        parent.appendChild(this.htmlElementMap[value.id]);
        parent.appendChild(h("label", [
          new Attribute("for", `${propertyHash}_${value.id}`) // assign label to radio input
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