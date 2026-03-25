import { createElement } from "./domService";

export default class Sidebar {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("sidebar requires a root element to mount.");
    }


    this.root = rootElement;
    this.root.classList.add("sidebar");


    this.addProjectButton = createElement("button", {
      className: "side-button",
      "aria-label": "create a new project"
    }, [
      createElement("span", { className: "material-icons" }, "add"),
      createElement("span", { className: "btn-text" }, "new project")
    ]);


    this.sideButtonsContainer = createElement("div", {
      className: "side-buttons-container"
    }, this.addProjectButton);

    this.completedProjectsContainer = createElement("div", {
      className: "completed-projects-container"
    });

    this.completedProjectsDrawer = createElement("div", {
      className: "completed-projects-drawer"
    });

    this.root.append(this.sideButtonsContainer, this.completedProjectsContainer, this.completedProjectsDrawer);
  }

  updateCompletedProjects(completedProjects) {
    this.completedProjectsContainer.replaceChildren();
    this.completedProjectsDrawer.replaceChildren();

    const count = completedProjects.length;
    if (count > 0) {
      const btn = createElement("button", {
        className: "side-button completed-projects-btn",
        "aria-label": `View ${count} completed projects`
      }, [
        createElement("span", { className: "material-icons" }, "check_circle"),
        createElement("span", { className: "btn-text" }, `completed (${count})`)
      ]);
      this.completedProjectsContainer.append(btn);

      const list = createElement("ul", {
        className: "completed-projects-list",
        style: "list-style: none; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.75rem;"
      }, completedProjects.map(project => 
        createElement("li", {
          className: "completed-project-item"
        }, [
          createElement("span", { 
            className: "completed-project-title",
            style: "text-decoration: line-through; opacity: 0.7; font-weight: 500; word-break: break-all;" 
          }, project.title),
          createElement("div", {
            className: "completed-project-actions"
          }, [
            createElement("button", {
              className: "restore-project-btn",
              "data-id": project.id,
              "aria-label": "Restore project to active"
            }, createElement("span", { className: "material-icons" }, "settings_backup_restore")),
            createElement("button", {
              className: "delete-project-btn",
              "data-id": project.id,
              "aria-label": "Delete project permanently"
            }, createElement("span", { className: "material-icons" }, "delete"))
          ])
        ])
      ));
      this.completedProjectsDrawer.append(list);
    }
  }

  toggleCompletedDrawer() {
    this.completedProjectsDrawer.classList.toggle("open");
  }
}
