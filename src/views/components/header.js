import { createElement } from "./domService";

export default class Header {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("header requires a root element to mount.");
    }



    this.root = rootElement;
    this.root.classList.add("header");


    this.headerContent = createElement("div", { className: "header-content" }, [
      createElement("h1", {}, "jot")
    ]);

    this.root.append(this.headerContent);
  }
}
