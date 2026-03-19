import { createElement } from "./components/domService.js";
import Header from "./components/header.js";
import Sidebar from "./components/sidebar.js";
import Whiteboard from "./components/whiteboard.js";

export default class Layout {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("layout requires a valid root element.");
    }

    // the layout class acts as the 'stable shell' of our application.
    // by mounting major components (header, sidebar, whiteboard) once,

    this.root = rootElement;

    // initializing the landmarks with their respective semantic tags.
    // the <header>, <aside>, and <main> tags are crucial for accessibility.
    this.header = new Header(createElement("header"));
    this.sidebar = new Sidebar(createElement("aside"));
    this.whiteboard = new Whiteboard(createElement("main"));

    // using a document fragment to 'batch' the initial mount off-screen.
    // this minimizes reflows and improves initial load performance.
    const fragment = document.createDocumentFragment();
    fragment.append(this.header.root, this.sidebar.root, this.whiteboard.root);

    // injecting the fragment completes the stable shell initialization.
    this.root.append(fragment);
  }
}
