export default class Whiteboard {
  constructor(rootElement) {
    if (!rootElement) {
      throw new Error("whiteboard requires a root element to mount.");
    }

    // the whiteboard is the application's central stage. it uses a 'drawer'
    // architecture to handle deep task nesting without visual clutter.
    this.root = rootElement;
    this.root.classList.add("whiteboard");

    // this container holds the initial project titles. clicking one
    // acts as the first tier of the progressive disclosure pattern.
    this.projectListContainer = document.createElement("div");
    this.projectListContainer.className = "whiteboard-project-list";

    // the horizontal drawer provides the second tier of disclosure.
    // it slides out to reveal a project's todos and checklists.
    this.horizontalDrawer = document.createElement("div");
    this.horizontalDrawer.className = "drawer-horizontal";
    this.horizontalDrawer.setAttribute("aria-hidden", "true");

    // the vertical drawer is the final tier of the disclosure pattern.
    // it provides deep details for specific todos or checklist items.
    this.verticalDrawer = document.createElement("div");
    this.verticalDrawer.className = "drawer-vertical";
    this.verticalDrawer.setAttribute("aria-hidden", "true");

    // appending these containers establishes our three levels of hierarchy.
    this.root.append(this.projectListContainer, this.horizontalDrawer, this.verticalDrawer);
  }

  // surgical render: update only the list of project titles.
  renderProjectList(projects) {
    this.projectListContainer.innerHTML = "";
    
    // a simple heading identifies the entry point for the user.
    const title = document.createElement("h2");
    title.textContent = "your projects";
    this.projectListContainer.append(title);

    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";

    projects.forEach((project) => {
      const listItem = document.createElement("li");

      // each title is a button to ensure it is interactive and accessible.
      const projectBtn = document.createElement("button");
      projectBtn.className = "whiteboard-project-btn";
      projectBtn.textContent = project.title;

      // data-id allows the controller to trigger the correct drawer update.
      projectBtn.setAttribute("data-id", project.id);
      projectBtn.setAttribute("aria-expanded", "false");
      projectBtn.setAttribute("aria-label", `open project: ${project.title}`);

      listItem.append(projectBtn);
      list.append(listItem);
    });

    this.projectListContainer.append(list);
  }

  // this opens the horizontal 'second-tier' drawer for project contents.
  openProjectDrawer(project) {
    // changing aria-hidden makes the new content visible to screen readers.
    this.horizontalDrawer.setAttribute("aria-hidden", "false");
    this.horizontalDrawer.classList.add("open");
    this.horizontalDrawer.innerHTML = "";

    const projectTitle = document.createElement("h3");
    projectTitle.textContent = project.title;
    this.horizontalDrawer.append(projectTitle);

    // TODO: implement logic to render todo/checklist titles here as buttons.
  }

  // this opens the vertical 'third-tier' drawer for specific task details.
  openTaskDetailDrawer(item) {
    this.verticalDrawer.setAttribute("aria-hidden", "false");
    this.verticalDrawer.classList.add("open");
    this.verticalDrawer.innerHTML = "";

    const itemTitle = document.createElement("h4");
    itemTitle.textContent = item.title;
    this.verticalDrawer.append(itemTitle);

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
