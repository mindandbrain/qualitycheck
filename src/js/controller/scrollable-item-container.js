//

import { SentinelObservingItemContainer } from "./item-container.js";

export class FixedChildDimensionItemContainer extends SentinelObservingItemContainer {
  constructor(DOMElement, orientation) {
    super(DOMElement, orientation);
  }
  
  addElementFront() {
    
  }
  addElementBack() {
    
  }
}

export class UnknownChildDimensionItemContainer extends SentinelObservingItemContainer {
  constructor(DOMElement, orientation) {
    super(DOMElement, orientation);
    
  }
  
  addElementFront() {
    
  }
  addElementBack() {
    
  }
}
