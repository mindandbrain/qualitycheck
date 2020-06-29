export class TreeNode<T extends TreeNode<T>> {
  parentNode: T | null = null;

  parentIndex: number;
  siblingIndex: number;

  previousSibling: T | null = null;
  nextSibling: T | null = null;

  childNodes: Array<T> = new Array<T>();

  get firstChild(): T | null {
    return this.childNodes.length ? this.childNodes[0] : null;
  }

  get lastChild(): T | null {
    return this.childNodes.length ? this.childNodes[this.childNodes.length - 1] : null;
  }

  updateSiblings(previousSibling: T | null = null): void {
    for (const [i, childNode] of this.childNodes.entries()) {
      childNode.parentIndex = i;
      childNode.previousSibling = previousSibling;
      if (previousSibling !== null) {
        childNode.siblingIndex = previousSibling.siblingIndex + 1;
        childNode.updateSiblings(previousSibling.lastChild);
        previousSibling.nextSibling = childNode;
      } else {
        childNode.siblingIndex = 0;
        childNode.updateSiblings();
      }
      previousSibling = childNode;
    }
  }

  appendChild(childNode: T): void {
    this.childNodes.push(childNode);
    childNode.parentNode = (this as unknown) as T;
  }
}
