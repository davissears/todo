export default class Header { // Fixed capitalization
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("Header requires a root element to mount.");
    }
    
    //  use the <header> tag passed in from Layout
    this.root = rootElement;
    this.root.classList.add("header"); // Style the root directly

    // create the content wrapper
    this.headerContent = document.createElement("div");
    this.headerContent.className = "header-content";

    // create the logo
    this.logo = document.createElement("h1");
    this.logo.textContent = "Jot";

    // append everything directly into the provided root
    this.headerContent.append(this.logo);
    this.root.append(this.headerContent);
  }
}
