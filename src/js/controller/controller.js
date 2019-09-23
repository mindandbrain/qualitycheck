//

const rAF = window.requestAnimationFrame;

export class Controller {
  #dataStore;
  
  constructor(dataStore) {
    this.#dataStore = dataStore;
    
    rAF(loop);
  }
  
  loop() {
    document.open();
    document.write("Hello");
    document.close();
    
    rAF(loop);
  }
}