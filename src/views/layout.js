import Header from "./components/header.js";

export default class Layout {
  constructor(rootElement) {
    this.root = rootElement;

    if (root) {
      const headerTag = document.createElement("header");
      root.append(headerTag);
      const header = new Header(headerTag);
      headerTag.append(header.element);
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
