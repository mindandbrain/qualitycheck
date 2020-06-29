import { Model } from "./model";
import { ViewModel } from "./view-model";
import { App, ErrorReport } from "./view";

import css from "./styles/index.scss";

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

Model.load()
  .then((model) => {
    const viewModel = new ViewModel(model);
    const app = new App(viewModel);
    document.body.appendChild(app);
  })
  .catch((error) => {
    // document.appendChild(new ErrorReport(error));
    throw error;
  });

//
// function handleError(errorText: string) {
//   const errorElement = document.createElement("div");
//   errorElement.id = "error";
//   errorElement.textContent = errorText;
//   document.body.appendChild(errorElement);
// }
//
// document.addEventListener("DOMContentLoaded", () => {
//   var script = document.createElement("script");
//   script.src = "qualitycheck.js";
//
//   script.onerror = (error) => {
//     handleError(`Failed to load ${script.src} with error
// ${JSON.stringify(error)}`);
//   }
//
//   document.body.appendChild(script);
// });
//
// window["qualitycheck"] = (id: string, items: BaseItem[]): void => {
//   // called by qualitycheck.js with data
//   // try {
//     const dataStore = new DataStore(id, items);
//     new ContentView(dataStore);
// //   } catch (error) {
// //     handleError(`Error
// // ${error}`);
// //   }
// };
