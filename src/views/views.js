import { createElement } from "./components/domService.js";
import Layout from "./layout.js";
import Modal from "./components/projectForm.js";

export default class View {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("view requires a valid root DOM element.");
    }

    // initializing the application's stable layout shell.
    this.root = rootElement;
    this.layout = new Layout(this.root);

    // instantiate the modal once so it remains stable in the DOM.
    this.projectForm = new Modal(this.root);
  }

  // binds the "new project" button click to show the modal.
  bindCreateProject(handler) {
    this.layout.sidebar.addProjectButton.addEventListener("click", handler);
  }

  // binds the actual form submission to a data handler.
  bindAddProject(handler) {
    this.projectForm.bindSubmitProject(handler);
  }

  showModal() {
    // we simply call the show method on our stable instance.
    this.projectForm.show();
  }

  // this facade method now directs updates to the whiteboard's project list.
  updateProjectList(projects) {
    // target the whiteboard specifically for project navigation.
    this.layout.whiteboard.renderProjectList(projects);
  }

  // this method allows the controller to trigger the second-tier disclosure.
  // it commands the whiteboard to open a project's horizontal drawer.
  bindProjectButton(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      handler,
    );
  }

  openProjectTaskDrawer(project) {
    this.layout.whiteboard.openProjectTaskDrawer(project);
  }

  // scoped selector to prevent global dom pollution and maintain modularity.
  getElement(selector) {
    return this.root.querySelector(selector);
  }
}
