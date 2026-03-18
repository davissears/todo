import { createElement } from "./domService";

export default class Whiteboard {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("whiteboard requires a root element to mount.");
    }

    this.root = rootElement;
    this.root.classList.add("whiteboard");

    // init containers 
    this.projectListContainer = createElement("div", {
      class: "whiteboard-project-list",
    });
    this.horizontalDrawer = createElement("div", {
      class: "drawer-horizontal",
      "aria-hidden": "true",
    });
    this.verticalDrawer = createElement("div", {
      class: "drawer-vertical",
      "aria-hidden": "true",
    });

    this.root.append(
      this.projectListContainer,
      this.horizontalDrawer,
      this.verticalDrawer,
    );
  }

  // surgical render: update only the list of project titles.
  renderProjectList(projects) {
    const title = createElement("h2", {}, "your projects");

    const list = createElement(
      "ul",
      { style: "list-style: none; padding: 0;" },
      projects.map((project) =>
        createElement(
          "li",
          {},
          createElement(
            "button",
            {
              class: "whiteboard-project-btn",
              "data-id": project.id,
              "aria-expanded": "false",
              "aria-label": `open project: ${project.title}`,
            },
            project.title,
          ),
        ),
      ),
    );

    this.projectListContainer.replaceChildren(title, list);
  }

  // this opens the horizontal drawer for project contents.
  openProjectTaskDrawer(project) {
    this.horizontalDrawer.setAttribute("aria-hidden", "false");
    this.horizontalDrawer.classList.add("open");

    const drawerContent = [
      createElement("h3", {}, project.title),
      createElement(
        "ul",
        { class: "drawer-items-list" },
        project.items.map((item) =>
          createElement(
            "li",
            {},
            createElement(
              "button",
              {
                class: "drawer-item-btn",
                "data-id": item.id,
                "aria-label": `View details for ${item.title}`,
              },
              item.title,
            ),
          ),
        ),
      ),
    ];

    this.horizontalDrawer.replaceChildren(...drawerContent);
  }

  // this opens the vertical drawer for specific task details.
  openProjectDetailDrawer(item) {
    this.verticalDrawer.setAttribute("aria-hidden", "false");
    this.verticalDrawer.classList.add("open");

    const itemTitle = createElement("h4", {}, item.title);
    this.verticalDrawer.replaceChildren(itemTitle);

    // TODO: implement logic to render notes, priority, and sub-items here.
  }

  // close all drawers to return to the project list view.
  closeAllDrawers() {
    this.horizontalDrawer.setAttribute("aria-hidden", "true");
    this.horizontalDrawer.classList.remove("open");
    this.verticalDrawer.setAttribute("aria-hidden", "true");
    this.verticalDrawer.classList.remove("open");
  }
}
