import { createElement } from "./domService";

const DEFAULT_STATUS = "ACTIVE";
const DEFAULT_PRIORITY = "NONE";

function normalizeWrappedText(value, key) {
  if (!value) return "";
  return typeof value === "string" ? value : (value[key] || "");
}

function getNoteText(note) {
  return normalizeWrappedText(note, "note");
}

function getPriorityText(priority) {
  return normalizeWrappedText(priority, "priority");
}

function getPriorityDisplay(priority, fallback = DEFAULT_PRIORITY) {
  return (getPriorityText(priority) || fallback).toString();
}

function getPriorityClass(priority, fallback = DEFAULT_PRIORITY) {
  return `priority-${getPriorityDisplay(priority, fallback).toLowerCase()}`;
}

function formatDateTime(dateTime, fallback = "") {
  if (!dateTime) return fallback;
  const dateValue = dateTime.date || dateTime;
  return new Date(dateValue).toLocaleString();
}

function createDetailRow(label, value, valueAttributes = { class: "detail-value" }) {
  return createElement("div", { class: "detail-row" }, [
    createElement("span", { class: "detail-label" }, label),
    createElement("span", valueAttributes, value)
  ]);
}

function createOptionalDetailRow(label, value, valueAttributes) {
  return value ? createDetailRow(label, value, valueAttributes) : null;
}

function formatOptionalDateTime(dateTime) {
  return dateTime ? formatDateTime(dateTime) : "";
}

function createIconButton(className, attributes, iconName) {
  return createElement("button", {
    class: className,
    ...attributes
  }, createElement("span", { class: "material-icons" }, iconName));
}

function createDrawerActions(actionButtons) {
  return createElement("div", { class: "drawer-actions" }, actionButtons);
}

function createProjectActionButtons(project) {
  const actionButtons = [];

  if (project.status !== "COMPLETE") {
    actionButtons.push(createIconButton("complete-project-btn", {
      "data-id": project.id,
      "title": "Complete project"
    }, "check_circle"));
  }

  actionButtons.push(
    createIconButton("edit-project-btn", {
      "data-id": project.id,
      "title": "Edit project"
    }, "edit"),
    createIconButton("delete-project-btn", {
      "data-id": project.id,
      "title": "Delete project"
    }, "delete")
  );

  return actionButtons;
}

function createProjectDetailRows(project) {
  const noteText = getNoteText(project.note);
  const priorityText = getPriorityDisplay(project.priority);

  return [
    createOptionalDetailRow("Description", project.description),
    createDetailRow("Status", project.status || DEFAULT_STATUS),
    createOptionalDetailRow("Due Date", formatOptionalDateTime(project.dueDateTime)),
    createOptionalDetailRow("Note", noteText),
    createDetailRow("Priority", priorityText, {
      class: `priority-tag ${getPriorityClass(project.priority)}`
    })
  ].filter(Boolean);
}

function createProjectDetailsColumn(project) {
  return createElement("div", { class: "project-details-column" }, [
    createElement("p", {
      style: "font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin: 0;"
    }, "Project Details"),
    ...createProjectDetailRows(project),
    createDrawerActions(createProjectActionButtons(project))
  ]);
}

function getItemPriorityClass(item) {
  return item.tier === "TODO" ? getPriorityClass(item.priority) : "";
}

function createDrawerItem(item, projectId, { completed = false } = {}) {
  const priorityClass = getItemPriorityClass(item);
  const buttonClasses = [
    "drawer-item-btn",
    completed ? "item-completed" : "",
    `item-${item.tier.toLowerCase()}`,
    priorityClass
  ].filter(Boolean).join(" ");
  const buttonAttributes = {
    class: buttonClasses,
    "data-id": item.id,
    "data-project-id": projectId
  };

  if (!completed) {
    buttonAttributes["aria-label"] = `View details for ${item.title}`;
  }

  return createElement("li", { class: "item-wrapper" }, [
    createElement("button", buttonAttributes, [
      createElement("span", { class: "item-title" }, item.title)
    ]),
    createElement("div", {
      class: "drawer-vertical item-detail-drawer",
      "data-item-id": item.id,
    })
  ]);
}

function createCompletedTasksTrigger(projectId, completedCount) {
  if (completedCount === 0) return null;

  return createElement("li", { class: "item-wrapper" }, [
    createElement("button", {
      class: "drawer-item-btn completed-tasks-btn",
      "data-project-id": projectId,
    }, `Completed Tasks (${completedCount})`)
  ]);
}

function createInlineAddItemButton(project) {
  return createElement("li", { class: "item-wrapper" }, [
    createElement("button", {
      class: "drawer-item-btn add-item-inline-btn",
      "data-project-id": project.id,
      "aria-label": `Add new item to ${project.title}`
    }, "+ Add")
  ]);
}

function createProjectVerticalContent(project) {
  const note = getNoteText(project.note);

  return createElement("div", { class: "detail-content" }, [
    createDetailRow("Description", project.description || "No description provided."),
    createDetailRow("Due Date", formatDateTime(project.dueDateTime, "No due date.")),
    createDetailRow("Note", note || "No notes."),
    createElement("button", {
      class: "add-item-btn",
      "data-project-id": project.id
    }, "+ Add Todo or Checklist"),
    createDrawerActions([
      createElement("button", {
        class: "edit-project-btn",
        "data-id": project.id
      }, "Edit"),
      createElement("button", {
        class: "delete-project-btn",
        "data-id": project.id
      }, "Delete")
    ])
  ]);
}

function createBaseItemDetailRows(item) {
  return [
    createDetailRow("Description", item.description || "No description provided."),
    createDetailRow("Status", item.status || DEFAULT_STATUS),
    createDetailRow("Due Date", formatDateTime(item.dueDateTime, "No due date."))
  ];
}

function createTodoDetailRows(item) {
  const noteText = getNoteText(item.note);
  const priorityText = getPriorityDisplay(item.priority);

  return [
    createDetailRow("Note", noteText || "No notes."),
    createDetailRow("Priority", priorityText, {
      class: `priority-tag ${getPriorityClass(item.priority)}`
    })
  ];
}

function createCheckItem(checkItem, checklistId, projectId) {
  return createElement("li", {
    class: "check-item-wrapper",
    style: "margin-bottom: 0.5rem;"
  }, [
    createElement("button", {
      class: `drawer-item-btn check-item-btn ${checkItem.status === "COMPLETE" ? "item-completed" : ""}`,
      "data-id": checkItem.id,
      "data-checklist-id": checklistId,
      "data-project-id": projectId,
      style: "width: 100%; text-align: left;"
    }, checkItem.title),
    createElement("div", {
      class: "drawer-vertical item-detail-drawer check-item-detail-drawer",
      "data-item-id": checkItem.id,
    })
  ]);
}

function createChecklistSection(checklist, projectId) {
  const section = [];

  if (checklist.items && checklist.items.length > 0) {
    section.push(createElement("h5", {
      style: "margin: 1rem 0 0.5rem 0; color: var(--text-secondary);"
    }, "Items"));
    section.push(createElement("ul", {
      class: "check-items-list",
      style: "list-style: none; padding: 0; margin-bottom: 1.5rem;"
    }, checklist.items.map(checkItem => createCheckItem(checkItem, checklist.id, projectId))));
  }

  section.push(createElement("button", {
    class: "add-checkitem-btn",
    "data-checklist-id": checklist.id,
    "data-project-id": projectId
  }, "+ Add Check Item"));

  return section;
}

function createTaskActionButtons(item, projectId) {
  const isComplete = item.status === "COMPLETE";
  const stateButton = isComplete
    ? createIconButton("restore-task-btn", {
      "data-id": item.id,
      "data-project-id": projectId,
      "title": "Restore task"
    }, "settings_backup_restore")
    : createIconButton("complete-task-btn", {
      "data-id": item.id,
      "data-project-id": projectId,
      "title": "Complete task"
    }, "check_circle");

  return [
    stateButton,
    createIconButton("edit-item-btn", {
      "data-id": item.id,
      "data-project-id": projectId,
      "title": "Edit task"
    }, "edit"),
    createIconButton("delete-item-btn", {
      "data-id": item.id,
      "data-project-id": projectId,
      "title": "Delete task"
    }, "delete")
  ];
}

function createItemDetailContent(item, projectId) {
  const contentChildren = [...createBaseItemDetailRows(item)];

  if (item.tier === "TODO") {
    contentChildren.push(...createTodoDetailRows(item));
  }

  if (item.tier === "CHECKLIST") {
    contentChildren.push(...createChecklistSection(item, projectId));
  }

  contentChildren.push(createDrawerActions(createTaskActionButtons(item, projectId)));

  return createElement("div", { class: "detail-content" }, contentChildren);
}

function collectProjectListState(root) {
  return {
    openHorizontal: new Set(Array.from(root.querySelectorAll(".drawer-horizontal.open")).map(el => el.dataset.id)),
    openVertical: new Set(Array.from(root.querySelectorAll(".drawer-vertical.open")).map(el => el.dataset.id)),
    openItems: new Set(Array.from(root.querySelectorAll(".item-detail-drawer.open")).map(el => el.dataset.itemId)),
    expandedButtons: new Set(Array.from(root.querySelectorAll(".drawer-item-btn.expanded")).map(el => el.dataset.id)),
  };
}

function restoreProjectDrawerState(container, projectId, state) {
  if (state.openHorizontal.has(projectId)) {
    container.querySelector(".drawer-horizontal").classList.add("open");
  }
  if (state.openVertical.has(projectId)) {
    container.querySelector(".drawer-vertical").classList.add("open");
  }
}

function restoreExpandedItem(container, itemId, expandedButtons) {
  if (!expandedButtons.has(itemId)) return;

  const btn = container.querySelector(`.drawer-item-btn[data-id="${itemId}"]`);
  if (!btn) return;

  btn.classList.add("expanded");
  const wrapper = btn.closest(".item-wrapper, .check-item-wrapper");
  if (wrapper) {
    wrapper.classList.add("expanded");
  }
}

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

    this.root.append(this.projectListContainer);
  }

  // surgical render: update the list of projects while preserving open drawer states.
  renderProjectList(projects) {
    const state = collectProjectListState(this.root);
    const activeProjects = projects.filter(p => p.status !== "COMPLETE");

    const projectElements = activeProjects.map(project => {
      const container = this.createProjectElement(project);
      restoreProjectDrawerState(container, project.id, state);
      this.restoreProjectItemState(container, project, state);

      return container;
    });

    this.projectListContainer.replaceChildren(...projectElements);
  }

  restoreProjectItemState(container, project, state) {
    project.items.forEach(item => {
      this.restoreItemState(container, project.id, item, state);

      if (item.tier === "CHECKLIST" && item.items) {
        item.items.forEach(checkItem => {
          this.restoreItemState(container, project.id, checkItem, state);
        });
      }
    });
  }

  restoreItemState(container, projectId, item, state) {
    restoreExpandedItem(container, item.id, state.expandedButtons);

    if (state.openItems.has(item.id)) {
      const itemDrawer = container.querySelector(`.item-detail-drawer[data-item-id="${item.id}"]`);
      if (itemDrawer) {
        this.renderItemDetailDrawer(item, itemDrawer, projectId, false);
        itemDrawer.classList.add("open");
      }
    }
  }

  createProjectElement(project) {
    const isComplete = project.status === "COMPLETE";
    const priority = getPriorityDisplay(project.priority);
    const header = createElement(
      "button",
      {
        class: `project-header ${isComplete ? 'project-completed-header' : ''} priority-${priority.toLowerCase()}`,
        "data-id": project.id,
        "aria-label": `Project: ${project.title}. Click for items, double-click for details.`,
      },
      [
        createElement("span", { 
          class: "project-title",
          style: isComplete ? "text-decoration: line-through; opacity: 0.6;" : ""
        }, project.title)
      ]
    );

    const horizontalDrawer = createElement("div", {
      class: "drawer-horizontal",
      "data-id": project.id,
    });

    const completedDrawer = createElement("div", {
      class: "drawer-horizontal drawer-completed",
      "data-id": project.id,
    });

    const verticalDrawer = createElement("div", {
      class: "drawer-vertical",
      "data-id": project.id,
    });

    const container = createElement("div", {
      class: `project-container ${isComplete ? 'project-completed' : ''}`,
      "data-id": project.id,
    }, [header, horizontalDrawer, completedDrawer, verticalDrawer]);

    // populate drawers AFTER container is created so parentElement is accessible
    this.renderHorizontalDrawer(project, horizontalDrawer);
    this.renderVerticalDrawer(project, verticalDrawer);

    return container;
  }

  renderHorizontalDrawer(project, drawerElement) {
    const activeItems = project.items.filter(item => item.status !== "COMPLETE");
    const completedItems = project.items.filter(item => item.status === "COMPLETE");

    const itemsList = createElement(
      "ul",
      { class: "drawer-items-list" },
      [
        ...activeItems.map(item => createDrawerItem(item, project.id)),
        createCompletedTasksTrigger(project.id, completedItems.length),
        createInlineAddItemButton(project)
      ]
    );

    drawerElement.replaceChildren(createProjectDetailsColumn(project), itemsList);

    // Also populate the actual completed drawer (initially hidden)
    const completedContainer = drawerElement.parentElement?.querySelector(".drawer-completed");
    if (completedContainer) {
      this.renderCompletedDrawer(completedItems, project.id, completedContainer);
    }
  }

  renderCompletedDrawer(completedItems, projectId, drawerElement) {
    const list = createElement(
      "ul",
      { class: "drawer-items-list" },
      completedItems.map(item => createDrawerItem(item, projectId, { completed: true }))
    );
    drawerElement.replaceChildren(list);
  }

  renderVerticalDrawer(project, drawerElement) {
    drawerElement.replaceChildren(createProjectVerticalContent(project));
  }

  renderItemDetailDrawer(item, drawerElement, projectId, shouldToggle = true) {
    drawerElement.replaceChildren(createItemDetailContent(item, projectId));
    if (shouldToggle) {
      drawerElement.classList.toggle("open");
    }
  }

  toggleCompletedDrawer(projectId) {
    const container = this.root.querySelector(`.project-container[data-id="${projectId}"]`);
    const completedDrawer = container.querySelector(".drawer-completed");
    completedDrawer.classList.toggle("open");
  }

  toggleHorizontalDrawer(projectId) {
    const container = this.root.querySelector(`.project-container[data-id="${projectId}"]`);
    const horDrawer = container.querySelector(".drawer-horizontal");
    const verDrawer = container.querySelector(".drawer-vertical");

    if (horDrawer.classList.contains("open") || verDrawer.classList.contains("open")) {
      horDrawer.classList.remove("open");
      verDrawer.classList.remove("open");
    } else {
      horDrawer.classList.add("open");
    }
  }

  toggleVerticalDrawer(projectId) {
    const container = this.root.querySelector(`.project-container[data-id="${projectId}"]`);
    const verDrawer = container.querySelector(".drawer-vertical");
    verDrawer.classList.toggle("open");
  }
}
