import { Model } from "./model";
import { ViewModel } from "./view-model";
import { App, Attribute, h, t } from "./view";

import css from "./styles/index.scss";

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

try {
  Model.load().then((model) => {
    const viewModel = new ViewModel(model);
    const app = new App(viewModel);
    document.body.appendChild(app);
  });
} catch (error) {
  document.appendChild(h("div", [new Attribute("class", "error")], [t(error)]));
  throw error;
}
