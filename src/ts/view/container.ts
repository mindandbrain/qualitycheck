import { ViewBase, Orientation } from "view/base";

export class Container extends ViewBase {
  public container: HTMLElement;
  
  constructor(parent: HTMLElement) {
    super(parent);
    
    this.container = parent;
  }
  
  public loop() {
    super.loop();
  }
}

const marginPercent: string = "-50%";
const zeroPixels: string = "0px";
const threshold = [0.0];

export abstract class SentinelObservingContainer extends Container {
  public orientation: Orientation;

  private frontWasIntersecting = false;
  private backWasIntersecting = false;

  private frontIntersectionObserver: IntersectionObserver;
  private backIntersectionObserver: IntersectionObserver;
  
  private toDoAddElementFront = false;
  private toDoAddElementBack = false;

  constructor(parent: HTMLElement, orientation: Orientation) {
    super(parent);
    this.orientation = orientation;

    let rootMarginFront: string, rootMarginBack: string;
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

    const frontIntersectionObserverCallback = 
    (changes: any, observer: IntersectionObserver) => {
      for (const change of changes) {
        if (change.isIntersecting) {
          this.frontWasIntersecting = true;
          observer.disconnect();
          return;
        }
      }
    };
    const backIntersectionObserverCallback = 
    (changes: any, observer: IntersectionObserver) => {
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
      root: this.container,
      rootMargin: rootMarginFront,
      threshold
    });
    this.backIntersectionObserver = new IntersectionObserver(
      backIntersectionObserverCallback.bind(this), {
      root: this.container,
      rootMargin: rootMarginFront,
      threshold
    });

    this.observeSentinelElements();
  }

  private observeSentinelElements(): void {
    const frontSentinelItem = <HTMLElement>this.container.firstChild;
    if (frontSentinelItem) {
      this.frontIntersectionObserver.disconnect();
      this.frontIntersectionObserver.observe(frontSentinelItem);
    } else {
      this.toDoAddElementFront = true; // we don't have any items yet
      return;
    }

    const backSentinelItem = <HTMLElement>this.container.lastChild;
    if (backSentinelItem) {
      this.backIntersectionObserver.disconnect();
      this.backIntersectionObserver.observe(backSentinelItem);
    }
  }

  public loop(): void {
    super.loop();
    
    if (this.toDoAddElementFront) {
      this.addElementFront();
      this.toDoAddElementFront = false;
      this.observeSentinelElements();
    }
    if (this.toDoAddElementBack) {
      this.addElementBack();
      this.toDoAddElementBack = false;
      this.observeSentinelElements();
    }
  }

  public abstract addElementFront(): void;
  public abstract addElementBack(): void;

}