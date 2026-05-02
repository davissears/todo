import Layout from "./layout.js";
import Modal from "./components/projectForm.js";
import ItemModal from "./components/itemModal.js";

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

  // binds the "new project" button click to show the modal.
  bindCreateProject(handler) {
    this.layout.sidebar.addProjectButton.addEventListener("click", handler);
  }

  bindThemeToggle(handler) {
    this.layout.header.themeToggleBtn.addEventListener("click", handler);
  }

  bindSidebarToggle(handler) {
    this.layout.header.sidebarToggleBtn.addEventListener("click", handler);
  }

  // binds the actual form submission to a data handler.
  bindAddProject(handler) {
    this.projectForm.bindSubmitProject(handler);
  }

  bindAddItem(handler) {
    this.itemForm.bindSubmit(handler);
  }

  bindProjectListClick(selector, handler, getArgs = (target) => [target]) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const target = event.target.closest(selector);
        if (target && this.layout.whiteboard.projectListContainer.contains(target)) {
          const args = getArgs(target, event);
          if (args) {
            handler(...args);
          }
        }
      }
    );
  }

  bindAddCheckItemButton(handler) {
    this.bindProjectListClick(
      ".add-checkitem-btn",
      handler,
      (btn) => [btn.dataset.projectId, btn.dataset.checklistId]
    );
  }

  bindEditProject(handler) {
    this.bindProjectListClick(".edit-project-btn", handler, (btn) => [btn.dataset.id]);
  }

  bindEditItem(handler) {
    this.bindProjectListClick(
      ".edit-item-btn",
      handler,
      (btn) => [btn.dataset.projectId, btn.dataset.id]
    );
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

  bindToggleCompletedProjects(handler) {
    this.layout.sidebar.completedProjectsContainer.addEventListener("click", (event) => {
      const btn = event.target.closest(".completed-projects-btn");
      if (btn) {
        handler();
      }
    });
  }

  // this method allows the controller to trigger the second-tier disclosure.
  // it commands the whiteboard to open a project's horizontal drawer.
  bindProjectButton(handler) {
    this.bindProjectListClick(
      ".project-header",
      handler,
      (header, event) => {
        const isButtonInDrawer = event.target.closest(".drawer-horizontal")
          || event.target.closest(".drawer-vertical");
        return isButtonInDrawer ? null : [event, header.dataset.id];
      }
    );
  }


  bindProjectDoubleClick(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "dblclick",
      (event) => {
        const header = event.target.closest(".project-header");
        if (header) {
          handler(event, header.dataset.id);
        }
      }
    );
  }

  bindAddItemButton(handler) {
    this.bindProjectListClick(".add-item-btn, .add-item-inline-btn", handler, (btn) => [btn.dataset.projectId]);
  }

  bindItemClick(handler) {
    this.bindProjectListClick(
      ".drawer-item-btn",
      handler,
      (btn) => {
        if (btn.classList.contains("add-item-inline-btn") || btn.classList.contains("completed-tasks-btn")) {
          return null;
        }

        const wrapper = btn.closest(".item-wrapper, .check-item-wrapper");
        if (wrapper) wrapper.classList.toggle("expanded");
        btn.classList.toggle("expanded");
        return [btn.dataset.projectId, btn.dataset.id];
      }
    );
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

  bindCompleteTask(handler) {
    this.bindProjectListClick(
      ".complete-task-btn",
      handler,
      (btn) => [btn.dataset.projectId, btn.dataset.id]
    );
  }

  bindRestoreTask(handler) {
    this.bindProjectListClick(
      ".restore-task-btn",
      handler,
      (btn) => [btn.dataset.projectId, btn.dataset.id]
    );
  }

  bindToggleCompletedDrawer(handler) {
    this.bindProjectListClick(".completed-tasks-btn", handler, (btn) => [btn.dataset.projectId]);
  }

  toggleCompletedDrawer(projectId) {
    this.layout.whiteboard.toggleCompletedDrawer(projectId);
  }

  toggleCompletedProjectsDrawer() {
    this.layout.sidebar.toggleCompletedDrawer();
  }

  bindCompleteProject(handler) {
    this.bindProjectListClick(".complete-project-btn", handler, (btn) => [btn.dataset.id]);
  }

  bindRestoreProject(handler) {
    this.bindCompletedProjectAction(".restore-project-btn", handler);
  }

  bindCompletedProjectAction(selector, handler) {
    this.layout.sidebar.completedProjectsDrawer.addEventListener("click", (event) => {
      const btn = event.target.closest(selector);
      if (btn) {
        handler(btn.dataset.id);
      }
    });
  }

  bindDeleteItem(handler) {
    this.bindProjectListClick(
      ".delete-item-btn",
      handler,
      (btn) => [btn.dataset.projectId, btn.dataset.id]
    );
  }

  bindDeleteProject(handler) {
    this.bindProjectListClick(".delete-project-btn", handler, (btn) => [btn.dataset.id]);
    this.bindCompletedProjectAction(".delete-project-btn", handler);
  }
}
