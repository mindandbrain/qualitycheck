

export class ScrollListener {
  
  constructor(el: HTMLElement) {
    
    el.addEventListener("wheel", zoom, {
      passive: true
    });
    
  }
  
}