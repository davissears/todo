export default class Header {
  constructor(rootElement) {
    // root of this element
    this.root = rootElement;
    // container for entire component
    this.element = document.createElement("div");
    // header
    this.element.className = "header";
    // header-Container
    this.headerContainer = document.createElement("div");
    this.headerContainer.className = "header-container";
    // title
    this.logo = document.createElement("h1");
    this.logo.textContent = "Jot";
    // logo-Container
    this.logoContainer = document.createElement("div");

    // append()
    this.root.append(this.element);
    this.element.append(this.headerContainer);
    this.headerContainer.append(this.logoContainer);
    this.logoContainer.append(this.logo);
  }
}
