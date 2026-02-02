import Header from "./components/header.js";

export default class Layout {
  constructor() {
    // this.root = rootElement;

    this.root = document.body;

    if (root) {
      const headerTag = document.createElement("header");
      root.append(headerTag);
      const header = new Header(headerTag);
    }
    // init components
    // this.header = new Header();
    // this.sidebar = new Sidebar();
    // this.whiteboard = new Whiteboard();
    // assemble layout
    // this.root.append(this.header.element);
    // TODO: append component class objects once written
  }
}
