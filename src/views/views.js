import Layout from "./layout.js";
import Modal from "./components/projectForm.js";
import ItemModal from "./components/itemModal.js";

function isDrawerClick(event) {
  return event.target.closest(".drawer-horizontal")
    || event.target.closest(".drawer-vertical");
}

function isSelectableItemButton(btn) {
  return !btn.classList.contains("add-item-inline-btn")
    && !btn.classList.contains("completed-tasks-btn");
}

function toggleExpandedItem(btn) {
  const wrapper = btn.closest(".item-wrapper, .check-item-wrapper");
  if (wrapper) wrapper.classList.toggle("expanded");
  btn.classList.toggle("expanded");
}

export default class View {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("view requires a valid root DOM element.");
    }

    // initializing the application's stable layout shell.
    this.root = rootElement;
    this.layout = new Layout(this.root);

    // instantiate the modals once so they remain stable in the DOM.
    this.projectForm = new Modal(this.root);
    this.itemForm = new ItemModal(this.root);
  }

  bindActions(actions) {
    this.bindStaticActions(actions);
    this.bindFormActions(actions);
    this.bindWhiteboardActions(actions);
    this.bindSidebarActions(actions);
  }

  bindStaticActions(actions) {
    this.bindElementAction(this.layout.sidebar.addProjectButton, "click", actions.showProjectForm);
    this.bindElementAction(this.layout.header.themeToggleBtn, "click", actions.toggleTheme);
    this.bindElementAction(this.layout.header.sidebarToggleBtn, "click", actions.toggleSidebar);
  }

  bindFormActions(actions) {
    if (actions.submitProjectForm) {
      this.projectForm.bindSubmitProject(actions.submitProjectForm);
    }
    if (actions.submitItemForm) {
      this.itemForm.bindSubmit(actions.submitItemForm);
    }
  }

  bindWhiteboardActions(actions) {
    this.bindDelegatedActions(
      this.layout.whiteboard.projectListContainer,
      "click",
      [
        {
          selector: ".add-item-btn, .add-item-inline-btn",
          handler: actions.addItem,
          getArgs: (btn) => [btn.dataset.projectId],
        },
        {
          selector: ".add-checkitem-btn",
          handler: actions.addCheckItem,
          getArgs: (btn) => [btn.dataset.projectId, btn.dataset.checklistId],
        },
        {
          selector: ".completed-tasks-btn",
          handler: actions.toggleCompletedTasks,
          getArgs: (btn) => [btn.dataset.projectId],
        },
        {
          selector: ".complete-task-btn",
          handler: actions.completeItem,
          getArgs: (btn) => [btn.dataset.projectId, btn.dataset.id],
        },
        {
          selector: ".restore-task-btn",
          handler: actions.restoreItem,
          getArgs: (btn) => [btn.dataset.projectId, btn.dataset.id],
        },
        {
          selector: ".edit-item-btn",
          handler: actions.editItem,
          getArgs: (btn) => [btn.dataset.projectId, btn.dataset.id],
        },
        {
          selector: ".delete-item-btn",
          handler: actions.deleteItem,
          getArgs: (btn) => [btn.dataset.projectId, btn.dataset.id],
        },
        {
          selector: ".complete-project-btn",
          handler: actions.completeProject,
          getArgs: (btn) => [btn.dataset.id],
        },
        {
          selector: ".edit-project-btn",
          handler: actions.editProject,
          getArgs: (btn) => [btn.dataset.id],
        },
        {
          selector: ".delete-project-btn",
          handler: actions.deleteProject,
          getArgs: (btn) => [btn.dataset.id],
        },
        {
          selector: ".drawer-item-btn",
          handler: actions.selectItem,
          getArgs: (btn) => {
            if (!isSelectableItemButton(btn)) return null;

            toggleExpandedItem(btn);
            return [btn.dataset.projectId, btn.dataset.id];
          },
        },
        {
          selector: ".project-header",
          handler: actions.selectProject,
          getArgs: (header, event) => (
            isDrawerClick(event) ? null : [event, header.dataset.id]
          ),
        },
      ]
    );

    this.bindDelegatedActions(
      this.layout.whiteboard.projectListContainer,
      "dblclick",
      [
        {
          selector: ".project-header",
          handler: actions.openProjectDetails,
          getArgs: (header, event) => [event, header.dataset.id],
        },
      ]
    );
  }

  bindSidebarActions(actions) {
    this.bindDelegatedActions(
      this.layout.sidebar.completedProjectsContainer,
      "click",
      [
        {
          selector: ".completed-projects-btn",
          handler: actions.toggleCompletedProjects,
        },
      ]
    );

    this.bindDelegatedActions(
      this.layout.sidebar.completedProjectsDrawer,
      "click",
      [
        {
          selector: ".restore-project-btn",
          handler: actions.restoreProject,
          getArgs: (btn) => [btn.dataset.id],
        },
        {
          selector: ".delete-project-btn",
          handler: actions.deleteProject,
          getArgs: (btn) => [btn.dataset.id],
        },
      ]
    );
  }

  bindDelegatedActions(container, eventType, routes) {
    const activeRoutes = routes.filter(route => route.handler);

    container.addEventListener(eventType, (event) => {
      const route = activeRoutes.find(({ selector }) => event.target.closest(selector));
      if (!route) return;

      const target = event.target.closest(route.selector);
      if (!target || !container.contains(target)) return;

      const args = route.getArgs ? route.getArgs(target, event) : [];
      if (args) {
        route.handler(...args);
      }
    });
  }

  bindElementAction(element, eventType, handler) {
    if (handler) {
      element.addEventListener(eventType, handler);
    }
  }

  showModal(data = null) {
    // we simply call the show method on our stable instance.
    this.projectForm.show(data);
  }

  showItemModal(projectId, tier = "TODO", checklistId = null, data = null) {
    this.itemForm.show(projectId, tier, checklistId, data);
  }

  // this facade method now directs updates to the whiteboard's project list.
  updateProjectList(projects) {
    // target the whiteboard specifically for project navigation.
    this.layout.whiteboard.renderProjectList(projects);
    
    // Update sidebar's completed projects
    const completedProjects = projects.filter(p => p.status === "COMPLETE");
    this.layout.sidebar.updateCompletedProjects(completedProjects);
  }

  toggleHorizontalDrawer(projectId) {
    this.layout.whiteboard.toggleHorizontalDrawer(projectId);
  }

  toggleVerticalDrawer(projectId) {
    this.layout.whiteboard.toggleVerticalDrawer(projectId);
  }

  openItemDetailDrawer(projectId, itemId, item) {
    const container = this.layout.whiteboard.root.querySelector(`.project-container[data-id="${projectId}"]`);
    const drawer = container.querySelector(`.item-detail-drawer[data-item-id="${itemId}"]`);
    this.layout.whiteboard.renderItemDetailDrawer(item, drawer, projectId);
  }

  toggleCompletedDrawer(projectId) {
    this.layout.whiteboard.toggleCompletedDrawer(projectId);
  }

  toggleCompletedProjectsDrawer() {
    this.layout.sidebar.toggleCompletedDrawer();
  }
}
