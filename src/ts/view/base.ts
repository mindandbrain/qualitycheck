export const enum Orientation {
  Horizontal,
  Vertical
}

function hasElement<T>(a: T[]): a is { shift(): T; } & Array<T> {
  return !(a.length == 0);
}

export class ViewBase {
  public parent: HTMLElement;
  
  public queue: Function[] = [];
  
  constructor(parent: HTMLElement) {
    this.parent = parent;
  }
  
  public loop() {
    while (hasElement(this.queue)) {
      this.queue.shift()();
    }
  }
}
