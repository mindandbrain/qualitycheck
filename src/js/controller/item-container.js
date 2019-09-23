//

const marginPercent = "-50%";
const zeroPixels = "0px";

const threshold = [0.0];

export class ItemContainer {
  DOMElement;
  
  constructor(DOMElement) {
    this.DOMElement = DOMElement;
  }
}

export class SentinelObservingItemContainer {
  orientation;
  
  #toDoAddElementFront = false;
  #toDoAddElementBack = false;
  
  #frontIntersectionObserver;
  #backIntersectionObserver;
  
  constructor(DOMElement, orientation) {
    super(DOMElement);
    this.orientation = orientation;
    
    let rootMarginFront, rootMarginBack;
    if (orientation == "horizontal") {
      rootMarginFront = `${zeroPixels} ${marginPercent} ${zeroPixels} ${zeroPixels}`;
      rootMarginBack  = `${zeroPixels} ${zeroPixels} ${zeroPixels} ${marginPercent}`;
    } else if (orientation === "vertical") {
      rootMarginFront = `${zeroPixels} ${zeroPixels} ${marginPercent} ${zeroPixels}`;
      rootMarginBack  = `${marginPercent} ${zeroPixels} ${zeroPixels} ${zeroPixels}`;
    } else {
      throw new Error(`Invalid orientation "#{orientation}".`)
    }
    
    this.#frontIntersectionObserver = new IntersectionObserver((changes, observer) => {
      for (const change of changes) {
        if (change.isIntersecting) {
          this.#toDoAddElementFront = true;
          observer.disconnect();
          return;
        }
      }
    }, {
      root: this.targetDOMElement,
      rootMargin: rootMarginFront,
      threshold
    });
    
    this.#backIntersectionObserver = new IntersectionObserver((changes, observer) => {
      for (const change of changes) {
        if (change.isIntersecting) {
          this.#toDoAddElementBack = true;
          observer.disconnect();
          return;
        }
      }
    }, {
      root: this.targetDOMElement,
      rootMargin: rootMarginBack,
      threshold
    });
    
    observeSentinelElements();
  }
  
  observeSentinelElements() {
    const frontSentinelItem = this.targetDOMElement.querySelector(".item:first-of-type");
    if (frontSentinelItem) {
      this.#frontIntersectionObserver.disconnect();
      this.#frontIntersectionObserver.observe(frontSentinelItem);
    } else {
      this.#toDoAddElementFront = true; // we don't have any items yet
      return;
    }
    
    const backSentinelItem = this.targetDOMElement.querySelector(".item:last-of-type");
    if (backSentinelItem) {
      this.#backIntersectionObserver.disconnect();
      this.#backIntersectionObserver.observe(backSentinelItem);
    }
  }
  
  onAnimationFrame() {
    let isDirty = false;
    if (this.#toDoAddElementFront) {
      this.addElementFront();
      this.#toDoAddElementFront = false;
      isDirty = true;
    }
    if (this.#toDoAddElementBack) {
      this.addElementBack();
      this.#toDoAddElementBack = false;
      isDirty = true;
    }
    if (isDirty) {
      observeSentinelElements();
    }
  }
  
  addElementFront() {
    throw new Error("Abstract function SentinelObservingItemContainer.addElementFront needs to be implemented.");
  }
  addElementBack() {
    throw new Error("Abstract function SentinelObservingItemContainer.addElementBack needs to be implemented.");
  }
  
}