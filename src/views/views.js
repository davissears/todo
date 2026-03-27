import { createElement } from "./components/domService.js";
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

  bindAddCheckItemButton(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        if (event.target.classList.contains("add-checkitem-btn")) {
          handler(event.target.dataset.projectId, event.target.dataset.checklistId);
        }
      }
    );
  }

  bindEditProject(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".edit-project-btn");
        if (btn) {
          handler(btn.dataset.id);
        }
      }
    );
  }

  bindEditItem(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".edit-item-btn");
        if (btn) {
          handler(btn.dataset.projectId, btn.dataset.id);
        }
      }
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
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        // Only trigger if clicking the header itself, not children like add buttons
        const header = event.target.closest(".project-header");
        const isButtonInDrawer = event.target.closest(".drawer-horizontal") || event.target.closest(".drawer-vertical");

        if (header && !isButtonInDrawer) {
          handler(event, header.dataset.id);
        }
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
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        if (event.target.classList.contains("add-item-btn") || event.target.classList.contains("add-item-inline-btn")) {
          handler(event.target.dataset.projectId);
        }
      }
    );
  }

  bindItemClick(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".drawer-item-btn");
        // Only expand if it's a real item button, not a trigger button like 'add' or 'completed'
        if (btn && !btn.classList.contains("add-item-inline-btn") && !btn.classList.contains("completed-tasks-btn")) {
          // Find the nearest wrapper ancestor of either type
          const wrapper = btn.closest(".item-wrapper, .check-item-wrapper");
          if (wrapper) wrapper.classList.toggle("expanded");
          btn.classList.toggle("expanded");
          handler(btn.dataset.projectId, btn.dataset.id);
        }
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
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".complete-task-btn");
        if (btn) {
          handler(btn.dataset.projectId, btn.dataset.id);
        }
      }
    );
  }

  bindToggleCompletedDrawer(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        if (event.target.classList.contains("completed-tasks-btn")) {
          handler(event.target.dataset.projectId);
        }
      }
    );
  }

  toggleCompletedDrawer(projectId) {
    this.layout.whiteboard.toggleCompletedDrawer(projectId);
  }

  bindCompleteProject(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".complete-project-btn");
        if (btn) {
          handler(btn.dataset.id);
        }
      }
    );
  }

  bindRestoreProject(handler) {
    this.layout.sidebar.completedProjectsDrawer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".restore-project-btn");
        if (btn) {
          handler(btn.dataset.id);
        }
      }
    );
  }

  bindDeleteItem(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".delete-item-btn");
        if (btn) {
          handler(btn.dataset.projectId, btn.dataset.id);
        }
      }
    );
  }

  bindDeleteProject(handler) {
    this.layout.whiteboard.projectListContainer.addEventListener(
      "click",
      (event) => {
        const btn = event.target.closest(".delete-project-btn");
        if (btn) {
          handler(btn.dataset.id);
        }
      }
    );
  }

  // scoped selector to prevent global dom pollution and maintain modularity.
  getElement(selector) {
    return this.root.querySelector(selector);
  }
}
