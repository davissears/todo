import { createElement } from "./domService";

export default class Sidebar {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("sidebar requires a root element to mount.");
    }


    this.root = rootElement;
    this.root.classList.add("sidebar");


    this.addProjectButton = createElement("button", {
      className: "side-button",
      "aria-label": "create a new project"
    }, "new project");


    this.sideButtonsContainer = createElement("div", {
      className: "side-buttons-container"
    }, this.addProjectButton);

    this.root.append(this.sideButtonsContainer);
  }
}
