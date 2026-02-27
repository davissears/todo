export default class Whiteboard {
  constructor(rootElement) {
    this.root = rootElement;
    this.element = document.createElement("div");
    this.element.className = "whiteboard";

    this.title = document.createElement("h2");
    this.title.textContent = "Your Projects";
    
    this.element.append(this.title);
  }
}
