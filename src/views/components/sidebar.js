export default class Sidebar {
  constructor(rootElement) {
    // root of this element
    this.root = rootElement;
    // container for the entire component
    this.element = document.createElement("div");
    this.element.className = "sidebar";
    //
    this.sidebarContent = document.createElement("div");
    this.sidebarContent.className = "sidebar-content";
    // buttons container
    this.sideButtonsContainer = document.createElement("div");
    this.sideButtonsContainer.className = "side-buttons-container";
    // buttons
    this.addProjectButton = document.createElement("button");
    this.addProjectButton.className = "side-buttons";
    this.addProjectButton.textContent = "Start Project";

    // append
    //  sidebar content
    this.element.append(this.sidebarContent);
    //  buttons container
    this.sidebarContent.append(this.sideButtonsContainer);
    // buttons
    this.sideButtonsContainer.append(this.addProjectButton);
  }
}
