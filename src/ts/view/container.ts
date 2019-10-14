import { Attribute, h, t } from "view/render";

import { ViewBase, Orientation } from "view/base";

export class Container extends ViewBase {
  public container: HTMLElement;
  
  public loop() {
    super.loop();
  }
}

const marginPercent: string = "-50%";
const zeroPixels: string = "0px";
const threshold = [0.0];

export class SentinelObserving extends Container {
  public orientation: Orientation;

  private frontWasIntersecting = false;
  private backWasIntersecting = false;

  private frontIntersectionObserver;
  private backIntersectionObserver;

  constructor(parent, orientation) {
    super(parent);
    this.orientation = orientation;

    let rootMarginFront, rootMarginBack;
    switch (this.orientation) {
      case Orientation.Horizontal:
        rootMarginFront = `${zeroPixels} ${marginPercent} ${zeroPixels} ${zeroPixels}`;
        rootMarginBack  = `${zeroPixels} ${zeroPixels} ${zeroPixels} ${marginPercent}`;
        break;
      case Orientation.Vertical:
        rootMarginFront = `${zeroPixels} ${zeroPixels} ${marginPercent} ${zeroPixels}`;
        rootMarginBack  = `${marginPercent} ${zeroPixels} ${zeroPixels} ${zeroPixels}`;
        break;
      default:
        throw new Error(`Invalid orientation "#{orientation}".`)
    }

    const frontIntersectionObserverCallback = (changes, observer) => {
      for (const change of changes) {
        if (change.isIntersecting) {
          this.frontWasIntersecting = true;
          observer.disconnect();
          return;
        }
      }
    };

    this.frontIntersectionObserver = new IntersectionObserver(
      frontIntersectionObserverCallback.bind(this), {
      root: this.targetDOMElement,
      rootMargin: rootMarginFront,
      threshold
    });

    const backIntersectionObserverCallback = (changes, observer) => {
      for (const change of changes) {
        if (change.isIntersecting) {
          this.backWasIntersecting = true;
          observer.disconnect();
          return;
        }
      }
    };

    this.frontIntersectionObserver = new IntersectionObserver(
      frontIntersectionObserverCallback.bind(this), {
      root: this.targetDOMElement,
      rootMargin: rootMarginFront,
      threshold
    });

    this.backIntersectionObserver = new IntersectionObserver((changes, observer) => {
      for (const change of changes) {
        if (change.isIntersecting) {
          this.backWasIntersecting = true;
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
      this.frontIntersectionObserver.disconnect();
      this.frontIntersectionObserver.observe(frontSentinelItem);
    } else {
      this.toDoAddElementFront = true; // we don't have any items yet
      return;
    }

    const backSentinelItem = this.targetDOMElement.querySelector(".item:last-of-type");
    if (backSentinelItem) {
      this.backIntersectionObserver.disconnect();
      this.backIntersectionObserver.observe(backSentinelItem);
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