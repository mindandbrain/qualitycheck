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
