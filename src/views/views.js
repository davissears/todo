export default class View {
  constructor() {
    console.log("View initialized");
    // root
    this.app = this.getElement("#root");

    // title / header
    this.title = this.createElement("h1");
    this.title.textContent = "Jot";
    
    // TODO: Other element conventions fo here.
  }
  
  // create
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
