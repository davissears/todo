// entrypoint: wiring the mvc architecture.
import Model from "./model/model.js";
import View from "./views/views.js";

function shouldUseChecklistParent(data) {
  return data.tier === "CHECKITEM" && data.checklistId;
}

function findChecklistParent(project, checklistId) {
  return project.items.find(item => item.id === checklistId) || null;
}

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

    // wiring up the user actions.
    this.view.bindCreateProject(this.handleShowModal);
    this.view.bindAddProject(this.handleAddProject);
    this.view.bindAddItem(this.handleAddItemSubmit);

    // new whiteboard interactions
    this.view.bindProjectButton(this.handleProjectClick);
    this.view.bindProjectDoubleClick(this.handleProjectDoubleClick);
    this.view.bindAddItemButton(this.handleAddItem);
    this.view.bindAddCheckItemButton(this.handleOpenCheckItemModal);
    this.view.bindItemClick(this.handleItemClick);
    this.view.bindDeleteItem(this.handleDeleteItem);
    this.view.bindDeleteProject(this.handleDeleteProject);
    this.view.bindCompleteTask(this.handleCompleteTask);
    this.view.bindRestoreTask(this.handleRestoreTask);
    this.view.bindCompleteProject(this.handleCompleteProject);
    this.view.bindRestoreProject(this.handleRestoreProject);
    this.view.bindToggleCompletedDrawer(this.handleToggleCompletedDrawer);
    this.view.bindToggleCompletedProjects(this.handleToggleCompletedProjects);
    this.view.bindEditProject(this.handleEditProject);
    this.view.bindEditItem(this.handleEditItem);
    this.view.bindThemeToggle(this.handleThemeToggle);
    this.view.bindSidebarToggle(this.handleSidebarToggle);
  }

  findProject(projectId) {
    return this.model.projects.find(project => project.id === projectId) || null;
  }

  resolveItemParent(data) {
    const project = this.findProject(data.projectId);
    if (!project) return null;

    return shouldUseChecklistParent(data)
      ? findChecklistParent(project, data.checklistId)
      : project;
  }

  applyProjectFormFields(project, data) {
    project.title = data.title;
    project.description = data.description;
    project.status = this.normalizeStatus(data.status);
    project.note = data.note;
    project.priority = data.priority;
    if (data.dueDate) project.dueDateTime = data.dueDate;
  }

  applyItemFormFields(item, data) {
    item.title = data.title;

    if (data.tier !== "CHECKITEM") {
      item.description = data.description;
      if (data.dueDate) item.dueDateTime = data.dueDate;
    }

    item.status = this.normalizeStatus(data.status);

    if (data.tier === "TODO") {
      item.note = data.note;
      item.priority = data.priority;
    }
  }

  normalizeStatus(status) {
    return status ? status.toUpperCase() : "ACTIVE";
  }

  setProjectStatus(projectId, status) {
    const project = this.findProject(projectId);
    if (!project) return;

    project.status = status;
    this.saveAndRefreshProjectList();
  }

  setItemStatus(projectId, itemId, status) {
    const result = this.model.findItem(projectId, itemId);
    if (!result) return;

    result.item.status = status;
    this.saveAndRefreshProjectList();
  }

  removeItemFromParent(parent, itemId) {
    const initialLength = parent.items.length;
    parent.items = parent.items.filter(item => item.id !== itemId);
    return parent.items.length !== initialLength;
  }

  deleteItem(projectId, itemId) {
    const project = this.findProject(projectId);
    if (!project) return false;

    if (this.removeItemFromParent(project, itemId)) {
      return true;
    }

    return project.items.some(item => (
      item.tier === "CHECKLIST"
      && item.items
      && this.removeItemFromParent(item, itemId)
    ));
  }

  refreshProjectList() {
    this.view.updateProjectList(this.model.projects);
  }

  saveAndRefreshProjectList() {
    this.model.save();
    this.refreshProjectList();
  }

  handleRestoreProject = (projectId) => {
    this.setProjectStatus(projectId, "ACTIVE");
  };

  handleSidebarToggle = () => {
    document.body.classList.toggle("sidebar-collapsed");
  };

  handleProjectClick = (event, projectId) => {
    this.view.toggleHorizontalDrawer(projectId);
  };

  handleProjectDoubleClick = (event, projectId) => {
    this.view.toggleVerticalDrawer(projectId);
  };

  handleAddItem = (projectId) => {
    this.view.showItemModal(projectId);
  };

  handleOpenCheckItemModal = (projectId, checklistId) => {
    this.view.showItemModal(projectId, "CHECKITEM", checklistId);
  };

  handleAddItemSubmit = (data) => {
    const targetParent = this.resolveItemParent(data);
    if (!targetParent) return;

    let item;
    if (data.isEdit) {
      item = targetParent.items.find(child => child.id === data.id);
    } else {
      this.model.createChild(data.title, data.tier, targetParent);
      item = targetParent.items[targetParent.items.length - 1];
    }

    if (item) {
      this.applyItemFormFields(item, data);
      this.saveAndRefreshProjectList();
    }
  };

  handleItemClick = (projectId, itemId) => {
    const result = this.model.findItem(projectId, itemId);
    if (!result) return;

    this.view.openItemDetailDrawer(projectId, itemId, result.item);
  };

  handleDeleteItem = (projectId, itemId) => {
    if (this.deleteItem(projectId, itemId)) {
      this.saveAndRefreshProjectList();
    }
  };

  handleDeleteProject = (projectId) => {
    this.model.deleteProject(projectId);
    this.refreshProjectList();
  };

  handleEditProject = (projectId) => {
    const project = this.findProject(projectId);
    if (project) {
      this.view.showModal(project);
    }
  };

  handleEditItem = (projectId, itemId) => {
    const result = this.model.findItem(projectId, itemId);
    if (!result) return;

    const isCheckItem = result.parent !== result.project;
    const tier = isCheckItem ? "CHECKITEM" : result.item.tier;
    const checklistId = isCheckItem ? result.parent.id : null;
    this.view.showItemModal(projectId, tier, checklistId, result.item);
  };

  handleCompleteTask = (projectId, itemId) => {
    this.setItemStatus(projectId, itemId, "COMPLETE");
  };

  handleRestoreTask = (projectId, itemId) => {
    this.setItemStatus(projectId, itemId, "ACTIVE");
  };

  handleCompleteProject = (projectId) => {
    this.setProjectStatus(projectId, "COMPLETE");
  };

  handleToggleCompletedDrawer = (projectId) => {
    this.view.toggleCompletedDrawer(projectId);
  };

  handleToggleCompletedProjects = () => {
    this.view.toggleCompletedProjectsDrawer();
  };

  // simple trigger to display the ui.
  handleShowModal = () => {
    this.view.showModal();
  };

  // logic to process the actual form data.
  handleAddProject = (data) => {
    let project;

    if (data.isEdit) {
      project = this.findProject(data.id);
    } else {
      this.model.createProject(data.title, data.description);
      project = this.model.projects[this.model.projects.length - 1];
    }

    if (project) {
      this.applyProjectFormFields(project, data);
      this.saveAndRefreshProjectList();
    }
  };

  // initial application data synchronization between model and view.
  init() {
    this.initTheme();
    // we fetch the current projects from the model and tell the
    // view facade to update the project navigation in the sidebar.
    this.refreshProjectList();
  }

  initTheme() {
    const isDarkMode = localStorage.getItem("jot-theme") === "dark";
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      const icon = this.view.layout.header.themeToggleBtn.querySelector(".material-icons");
      if (icon) icon.textContent = "light_mode";
    }
  }

  handleThemeToggle = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("jot-theme", isDark ? "dark" : "light");

    const icon = this.view.layout.header.themeToggleBtn.querySelector(".material-icons");
    if (icon) {
      icon.textContent = isDark ? "light_mode" : "dark_mode";
    }
  };
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
    initApp();
  });
}
