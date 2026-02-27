import Layout from "./layout.js";

export default class View {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("view requires a valid root DOM element.");
    }

    // initializing the application's stable layout shell.
    this.root = rootElement;
    this.layout = new Layout(this.root);
  }

  // this facade method now directs updates to the whiteboard's project list.
  // since navigation is localized to the main section, we avoid cluttering 
  // the sidebar and maintain a focused, 'one-level-at-a-time' interface.
  updateProjectList(projects) {
    // we now target the whiteboard specifically for project navigation.
    this.layout.whiteboard.renderProjectList(projects);
  }

  // this method allows the controller to trigger the second-tier disclosure.
  // it commands the whiteboard to open a project's horizontal drawer.
  showProjectDetail(project) {
    this.layout.whiteboard.openProjectDrawer(project);
  }

  // this utility helper creates elements with classes, aiding surgical render logic.
  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    return element;
  }

  // scoped selector to prevent global dom pollution and maintain modularity.
  getElement(selector) {
    return this.root.querySelector(selector);
  }
}
