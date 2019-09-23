import { DataStore } from "./model/data-store.js";
import { Controller } from "./controller/controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.src = src;
      
      script.onload = resolve;
      script.onerror = (error) => {
        reject(new Error(`Failed to load ${src} with error ${JSON.stringify(error)}`));
      }
      
      document.body.appendChild(script);
    });
  }
  loadScript("qualitycheck.js").catch((error) => {
    const errorElement = document.createElement("div");
    errorElement.textContent = error.toString();
    document.body.appendChild(errorElement);
  })
});

const qualitycheck = (baseData) => {
  const dataStore = new DataStore(baseData);
  new Controller(dataStore);
};

export default qualitycheck;

import "../scss/main.scss";