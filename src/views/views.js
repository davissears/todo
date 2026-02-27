import Layout from "./layout.js";

export default class View {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("View requires a valid root DOM element.");
    }
    
    this.root = rootElement;
    
    // pass the main container down to the Layout component
    this.layout = new Layout(this.root);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    return element;
  }

  getElement(selector) {
    // scoped to the app root to prevent global document leaks
    return this.root.querySelector(selector);
  }
}
