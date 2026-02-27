import Header from "./components/header.js";
import Sidebar from "./components/sidebar.js";
import Whiteboard from "./components/whiteboard.js";

export default class Layout {
  constructor(rootElement) {
    this.root = rootElement;

    if (this.root) {
      // 2. Initialize and append Header
      const headerTag = document.createElement("header");
      this.root.append(headerTag);
      this.header = new Header(headerTag);
      headerTag.append(this.header.element);

      // 3. Initialize and append Sidebar
      const sidebarTag = document.createElement("aside"); // Using semantic <aside>
      this.root.append(sidebarTag);
      this.sidebar = new Sidebar(sidebarTag);
      sidebarTag.append(this.sidebar.element);

      // 3. Whiteboard (Main Content)
      const mainTag = document.createElement("main");
      this.root.append(mainTag);
      this.whiteboard = new Whiteboard(mainTag);
      mainTag.append(this.whiteboard.element);
    }
  }
}
