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
    this.view.bindCompleteProject(this.handleCompleteProject);
    this.view.bindRestoreProject(this.handleRestoreProject);
    this.view.bindToggleCompletedDrawer(this.handleToggleCompletedDrawer);
    this.view.bindToggleCompletedProjects(this.handleToggleCompletedProjects);
    this.view.bindEditProject(this.handleEditProject);
    this.view.bindEditItem(this.handleEditItem);
    this.view.bindThemeToggle(this.handleThemeToggle);
    this.view.bindSidebarToggle(this.handleSidebarToggle);

    // Sidebar completed projects delete
    this.view.layout.sidebar.completedProjectsDrawer.addEventListener("click", (event) => {
      const btn = event.target.closest(".delete-project-btn");
      if (btn) {
        this.handleDeleteProject(btn.dataset.id);
      }
    });
  }

  handleRestoreProject = (projectId) => {
    const project = this.model.projects.find(p => p.id === projectId);
    if (project) {
      project.status = "ACTIVE";
      this.model.save();
      this.view.updateProjectList(this.model.projects);
    }
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
    const parentProject = this.model.projects.find(p => p.id === data.projectId);
    if (!parentProject) return;

    let targetParent = parentProject;
    if (data.tier === "CHECKITEM" && data.checklistId) {
      targetParent = parentProject.items.find(i => i.id === data.checklistId);
    }

    if (targetParent) {
      let item;
      if (data.isEdit) {
        item = targetParent.items.find(i => i.id === data.id);
        if (item) {
          item.title = data.title;
        }
      } else {
        this.model.createChild(data.title, data.tier, targetParent);
        item = targetParent.items[targetParent.items.length - 1];
      }

      if (item) {
        if (data.tier !== "CHECKITEM") {
          item.description = data.description;
          if (data.dueDate) item.dueDateTime = data.dueDate;
        }

        item.status = data.status ? data.status.toUpperCase() : "ACTIVE";

        if (data.tier === "TODO") {
          item.note = data.note;
          item.priority = data.priority;
        }
        this.model.save();
        this.view.updateProjectList(this.model.projects);
      }
    }
  };

  handleItemClick = (projectId, itemId) => {
    const project = this.model.projects.find((p) => p.id === projectId);
    if (!project) return;

    // First tier: Todos and Checklists
    let item = project.items.find((i) => i.id === itemId);

    // Second tier: Checkitems inside Checklists
    if (!item) {
      for (const pItem of project.items) {
        if (pItem.tier === "CHECKLIST" && pItem.items) {
          item = pItem.items.find(ci => ci.id === itemId);
          if (item) break;
        }
      }
    }

    if (!item) return;

    this.view.openItemDetailDrawer(projectId, itemId, item);
  };

  handleDeleteItem = (projectId, itemId) => {
    const project = this.model.projects.find(p => p.id === projectId);
    if (project) {
      // First tier
      const initialLen = project.items.length;
      project.items = project.items.filter(i => i.id !== itemId);

      // If nothing was deleted, check nested checklists
      if (project.items.length === initialLen) {
        for (const item of project.items) {
          if (item.tier === "CHECKLIST" && item.items) {
            item.items = item.items.filter(ci => ci.id !== itemId);
          }
        }
      }

      this.model.save();
      this.view.updateProjectList(this.model.projects);
    }
  };

  handleDeleteProject = (projectId) => {
    this.model.deleteProject(projectId);
    this.view.updateProjectList(this.model.projects);
  };

  handleEditProject = (projectId) => {
    const project = this.model.projects.find(p => p.id === projectId);
    if (project) {
      this.view.showModal(project);
    }
  };

  handleEditItem = (projectId, itemId) => {
    const project = this.model.projects.find(p => p.id === projectId);
    if (!project) return;

    let item = project.items.find(i => i.id === itemId);
    let tier = item ? item.tier : null;
    let checklistId = null;

    if (!item) {
      for (const pItem of project.items) {
        if (pItem.tier === "CHECKLIST" && pItem.items) {
          item = pItem.items.find(ci => ci.id === itemId);
          if (item) {
            tier = "CHECKITEM";
            checklistId = pItem.id;
            break;
          }
        }
      }
    }

    if (item) {
      this.view.showItemModal(projectId, tier, checklistId, item);
    }
  };

  handleCompleteTask = (projectId, itemId) => {
    const project = this.model.projects.find(p => p.id === projectId);
    if (project) {
      let item = project.items.find(i => i.id === itemId);
      if (!item) {
        for (const pItem of project.items) {
          if (pItem.tier === "CHECKLIST" && pItem.items) {
            item = pItem.items.find(ci => ci.id === itemId);
            if (item) break;
          }
        }
      }

      if (item) {
        item.status = "COMPLETE";
        this.model.save();
        this.view.updateProjectList(this.model.projects);
      }
    }
  };

  handleCompleteProject = (projectId) => {
    const project = this.model.projects.find(p => p.id === projectId);
    if (project) {
      project.status = "COMPLETE";
      this.model.save();
      this.view.updateProjectList(this.model.projects);
    }
  };

  handleToggleCompletedDrawer = (projectId) => {
    this.view.toggleCompletedDrawer(projectId);
  };

  handleToggleCompletedProjects = () => {
    this.view.layout.sidebar.toggleCompletedDrawer();
  };

  // simple trigger to display the ui.
  handleShowModal = () => {
    this.view.showModal();
  };

  // logic to process the actual form data.
  handleAddProject = (data) => {
    if (data.isEdit) {
      const project = this.model.projects.find(p => p.id === data.id);
      if (project) {
        project.title = data.title;
        project.description = data.description;
        project.status = data.status ? data.status.toUpperCase() : "ACTIVE";
        project.note = data.note;
        project.priority = data.priority;
        if (data.dueDate) project.dueDateTime = data.dueDate;
      }
    } else {
      this.model.createProject(data.title, data.description);
      const newProject = this.model.projects[this.model.projects.length - 1];
      newProject.status = data.status ? data.status.toUpperCase() : "ACTIVE";
      newProject.note = data.note;
      newProject.priority = data.priority;
      if (data.dueDate) newProject.dueDateTime = data.dueDate;
    }

    this.model.save();

    // refresh the view
    this.view.updateProjectList(this.model.projects);
  };

  // initial application data synchronization between model and view.
  init() {
    this.initTheme();
    // we fetch the current projects from the model and tell the
    // view facade to update the project navigation in the sidebar.
    this.view.updateProjectList(this.model.projects);
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
