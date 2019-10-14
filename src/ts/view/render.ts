export class Attribute {
  key: string;
  value: string;
  
  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

// inspired by hyperscript
export function h(tag: string, attrs: Attribute[], children: Node[]): HTMLElement {
  let element: HTMLElement = document.createElement(tag);
  
  for (let attr of attrs) {
    element.setAttribute(attr.key, attr.value);
  }
  
  for (let child of children) {
    element.appendChild(child);
  }
  
  return element;
};

export function t(s: string): Node {
  return document.createTextNode(s);
}
