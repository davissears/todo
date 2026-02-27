export default class Sidebar {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("Sidebar requires a root element to mount.");
    }

    // 1. Use the <aside> tag passed from Layout
    this.root = rootElement;
    this.root.classList.add("sidebar"); 

    // 2. Create the buttons container
    // We can skip the 'sidebar-content' div entirely and just use the root!
    this.sideButtonsContainer = document.createElement("div");
    this.sideButtonsContainer.className = "side-buttons-container";

    // 3. Create the button (Fixed class name to singular)
    this.addProjectButton = document.createElement("button");
    this.addProjectButton.className = "side-button"; 
    this.addProjectButton.textContent = "Start Project";

    // 4. Append directly to the root
    this.sideButtonsContainer.append(this.addProjectButton);
    this.root.append(this.sideButtonsContainer);
  }
}
