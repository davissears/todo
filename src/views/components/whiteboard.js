export default class Whiteboard {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("Whiteboard requires a root element to mount.");
    }

    // Use the <main> tag passed from Layout
    this.root = rootElement;
    this.root.classList.add("whiteboard");

    // Create the title
    this.title = document.createElement("h2");
    this.title.textContent = "Your Projects";
    
    // Append directly to the root
    this.root.append(this.title);
  }
}
