export default class Header {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("header requires a root element to mount.");
    }

    // the header acts as a constant landmark that identifies the application.
    // by keeping it stable, we provide users with a consistent sense of 'home'.
    this.root = rootElement;
    this.root.classList.add("header");

    // this wrapper helps with centering and layout without exposing 
    // the root's semantic structure to potentially breaking css.
    this.headerContent = document.createElement("div");
    this.headerContent.className = "header-content";

    // the application logo/title provides immediate visual and screen reader
    // confirmation of which application the user is currently interacting with.
    this.logo = document.createElement("h1");
    this.logo.textContent = "jot";

    this.headerContent.append(this.logo);
    this.root.append(this.headerContent);
  }
}
