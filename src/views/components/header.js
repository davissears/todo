export default class Header {
  constructor(rootElement) {
    // root of this element
    this.root = rootElement;
    // container for entire component
    this.element = document.createElement("div");
    // header
    this.element.className = "header";
    // header-Container
    this.headerContent = document.createElement("div");
    this.headerContent.className = "header-content";
    // title
    this.logo = document.createElement("h1");
    this.logo.textContent = "Jot";
    // logo-Container
    this.logoContainer = document.createElement("div");

    // append
    this.element.append(this.headerContent);
    this.headerContent.append(this.logoContainer);
    this.logoContainer.append(this.logo);
  }
}
