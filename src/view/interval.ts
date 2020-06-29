import { PropertyComparator } from "../model";

export class Interval {
  lower: number;
  upper: number;

  constructor(lower: number, upper: number) {
    this.lower = lower;
    this.upper = upper;
  }
}

const ic = PropertyComparator<Interval>("lower");

export class IntervalSet {
  // adapted from https://gist.github.com/vrachieru/5649bce26004d8a4682b

  stack: Array<Interval> = new Array<Interval>();

  constructor() {}

  add(i: Interval): void {
    const arr = [...this.stack, i];
    arr.sort(ic);
    this.stack = [arr.shift()];
    for (const j of arr) {
      let top = this.stack[this.stack.length - 1];

      if (top.upper < j.lower) {
        // if the current interval doesn't overlap with the
        // stack top element, push it to the stack
        this.stack.push(j);
      } else if (top.upper < j.upper) {
        // otherwise update the end value of the top element
        // if end of current interval is higher
        top.upper = j.upper;
      }
    }
  }

  findXWithNoOverlapClosestTo0(r: number, allowNegative: boolean): number {
    if (this.stack.length === 0) {
      return 0;
    }
    let x = Infinity;
    for (let i = 0; i < this.stack.length; i++) {
      // try to insert below
      let candx = this.stack[i].lower - r;
      if (i > 0) {
        if (this.stack[i - 1].upper > candx - r) {
          // overlaps
          continue;
        }
      }
      if (!allowNegative && candx < 0) {
        continue;
      }
      if (Math.abs(candx) < Math.abs(x)) {
        x = candx;
      }
    }
    for (let i = 0; i < this.stack.length; i++) {
      // try to insert above
      let candx = this.stack[i].upper + r;
      if (i < this.stack.length - 1) {
        if (this.stack[i + 1].lower < candx + r) {
          // overlaps
          continue;
        }
      }
      if (!allowNegative && candx < 0) {
        continue;
      }
      if (Math.abs(candx) < Math.abs(x)) {
        x = candx;
      }
    }
    return x;
  }
}
