import Header from "./components/header.js";
import Sidebar from "./components/sidebar.js";
import Whiteboard from "./components/whiteboard.js";

export default class Layout {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("Layout requires a valid root DOM element to mount.");
    }
    
    this.root = rootElement;

    // create a DocumentFragment to batch our DOM updates
    const fragment = document.createDocumentFragment();

    // init Header
    const headerTag = document.createElement("header");
    this.header = new Header(headerTag); 
    fragment.append(headerTag);

    // init Sidebar
    const sidebarTag = document.createElement("aside");
    this.sidebar = new Sidebar(sidebarTag); 
    fragment.append(sidebarTag);

    // init Whiteboard (Main Content)
    const mainTag = document.createElement("main");
    this.whiteboard = new Whiteboard(mainTag);
    fragment.append(mainTag);

    // append the fully constructed layout to the live DOM in one go
    this.root.append(fragment);
  }
}
