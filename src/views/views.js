import Layout from "./layout.js";

export default class View {
  constructor(rootElement) {
    this.root = rootElement;
    this.layout = new Layout(this.root);
    console.log("View initialized");
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }
  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }
}
