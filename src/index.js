// entrypoint: wiring the mvc architecture.
import Model from "./model/model.js";
import View from "./views/views.js";

// the controller acts as the central coordinator. it processes user
// input from the view and translates it into model updates.
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // during initialization, we perform the first 'surgical' render.
    // by calling updateprojectlist, we populate the sidebar using 
    // the stable shell already created by the view's layout.
    this.init();
  }

  // initial application data synchronization between model and view.
  init() {
    // we fetch the current projects from the model and tell the 
    // view facade to update the project navigation in the sidebar.
    this.view.updateProjectList(this.model.projects);
    console.log("controller initialized. application data synced.");
  }
}

// this function scaffolds the application and mounts it to the root dom element.
function initApp() {
  const rootElement = document.querySelector("#root");
  if (rootElement) {
    // clearing existing content is only done once at the very start 
    // to handle hot module replacement (hmr) and initial setup.
    rootElement.innerHTML = "";
  }

  // a new instance of the application with its model, view, and controller.
  // the controller takes responsibility for linking the model and view data.
  const app = new Controller(new Model(), new View(rootElement));
  
  // exposing the app globally can be useful for debugging in the console.
  window.app = app;
}

initApp();

// hot module replacement support for development.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("hmr: reloading application state...");
    initApp();
  });
}
