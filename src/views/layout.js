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
    // we establish landmarks that assistive tech can reliably identify.
    this.root = rootElement;

    // using a document fragment allows us to 'batch' the initial mount.
    // this minimizes the number of reflows by building the layout off-screen 
    // and injecting it into the live dom as a single operation.
    const fragment = document.createDocumentFragment();

    // each landmark is initialized with its semantic tag. the aside tag
    // ensures the sidebar is identified as complementary navigation.
    const headerTag = document.createElement("header");
    this.header = new Header(headerTag);
    fragment.append(headerTag);

    const sidebarTag = document.createElement("aside");
    this.sidebar = new Sidebar(sidebarTag);
    fragment.append(sidebarTag);

    // the <main> tag is crucial for accessibility. it identifies the 
    // core application content that users can 'skip' to using shortcuts.
    const mainTag = document.createElement("main");
    this.whiteboard = new Whiteboard(mainTag);
    fragment.append(mainTag);

    // injecting the fragment completes the stable shell initialization.
    this.root.append(fragment);
  }
}
