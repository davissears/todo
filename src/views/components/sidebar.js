export default class Sidebar {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("sidebar requires a root element to mount.");
    }

    // the sidebar now acts as a pure utility area for global actions.
    // project navigation has been moved to the whiteboard to support
    // the 'progressive disclosure' and 'drawer' patterns.
    this.root = rootElement;
    this.root.classList.add("sidebar");

    // this container remains the stable home for global application actions.
    this.sideButtonsContainer = document.createElement("div");
    this.sideButtonsContainer.className = "side-buttons-container";

    // 'new project' is the primary trigger for adding data to the whiteboard.
    this.addProjectButton = document.createElement("button");
    this.addProjectButton.className = "side-button";
    this.addProjectButton.textContent = "new project";
    this.addProjectButton.setAttribute("aria-label", "create a new project");

    this.sideButtonsContainer.append(this.addProjectButton);
    this.root.append(this.sideButtonsContainer);
  }
}
