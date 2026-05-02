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

    this.root.append(this.projectListContainer);
  }

  // surgical render: update the list of projects while preserving open drawer states.
  renderProjectList(projects) {
    const openHorizontal = Array.from(this.root.querySelectorAll(".drawer-horizontal.open")).map(el => el.dataset.id);
    const openVertical = Array.from(this.root.querySelectorAll(".drawer-vertical.open")).map(el => el.dataset.id);
    const openItems = Array.from(this.root.querySelectorAll(".item-detail-drawer.open")).map(el => el.dataset.itemId);
    
    // Preserve expanded state for item-wrappers and buttons
    const expandedButtons = Array.from(this.root.querySelectorAll(".drawer-item-btn.expanded"))
      .map(el => el.dataset.id);

    const activeProjects = projects.filter(p => p.status !== "COMPLETE");

    const projectElements = activeProjects.map(project => {
      const container = this.createProjectElement(project);
      
      if (openHorizontal.includes(project.id)) {
        container.querySelector(".drawer-horizontal").classList.add("open");
      }
      if (openVertical.includes(project.id)) {
        container.querySelector(".drawer-vertical").classList.add("open");
      }
      
      // Check for open item drawers within this project (and its nested checkitems)
      project.items.forEach(item => {
        // Restore expanded states for the item itself
        if (expandedButtons.includes(item.id)) {
          const btn = container.querySelector(`.drawer-item-btn[data-id="${item.id}"]`);
          if (btn) {
            btn.classList.add("expanded");
            // Also restore the wrapper's expanded state
            const wrapper = btn.closest(".item-wrapper, .check-item-wrapper");
            if (wrapper) wrapper.classList.add("expanded");
          }
        }

        const restoreDrawer = (targetItem, targetId) => {
          if (openItems.includes(targetId)) {
            const itemDrawer = container.querySelector(`.item-detail-drawer[data-item-id="${targetId}"]`);
            if (itemDrawer) {
              this.renderItemDetailDrawer(targetItem, itemDrawer, project.id, false);
              itemDrawer.classList.add("open");
            }
          }
        };

        restoreDrawer(item, item.id);
        
        if (item.tier === "CHECKLIST" && item.items) {
          item.items.forEach(checkItem => {
            // Restore expanded states for nested checkitems
            if (expandedButtons.includes(checkItem.id)) {
              const btn = container.querySelector(`.drawer-item-btn[data-id="${checkItem.id}"]`);
              if (btn) {
                btn.classList.add("expanded");
                const wrapper = btn.closest(".check-item-wrapper, .item-wrapper");
                if (wrapper) wrapper.classList.add("expanded");
              }
            }
            restoreDrawer(checkItem, checkItem.id);
          });
        }
      });

      return container;
    });

    this.projectListContainer.replaceChildren(...projectElements);
  }

  createProjectElement(project) {
    const isComplete = project.status === "COMPLETE";
    const priority = project.priority ? (typeof project.priority === 'string' ? project.priority : project.priority.priority) : "NONE";
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

    // Project Details Column
    const getNoteText = (obj) => {
      if (!obj) return "";
      return typeof obj === "string" ? obj : (obj.note || "");
    };
    const getPriorityText = (obj) => {
      if (!obj) return "";
      return typeof obj === "string" ? obj : (obj.priority || "");
    };

    const noteText = getNoteText(project.note);
    const priorityText = getPriorityText(project.priority);
    const detailRows = [];

    if (project.description) {
      detailRows.push(createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Description"),
        createElement("span", { class: "detail-value" }, project.description)
      ]));
    }
    
    // Always show status for project, default to ACTIVE if missing
    const statusText = project.status || "ACTIVE";
    detailRows.push(createElement("div", { class: "detail-row" }, [
      createElement("span", { class: "detail-label" }, "Status"),
      createElement("span", { class: "detail-value" }, statusText)
    ]));

    if (project.dueDateTime) {
      const dateValue = project.dueDateTime.date || project.dueDateTime;
      detailRows.push(createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Due Date"),
        createElement("span", { class: "detail-value" }, new Date(dateValue).toLocaleString())
      ]));
    }
    if (noteText) {
      detailRows.push(createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Note"),
        createElement("span", { class: "detail-value" }, noteText)
      ]));
    }
    
    // Always show priority
    const displayPriority = (priorityText || "NONE").toString();
    detailRows.push(createElement("div", { class: "detail-row" }, [
      createElement("span", { class: "detail-label" }, "Priority"),
      createElement("span", { 
        class: `priority-tag priority-${displayPriority.toLowerCase()}` 
      }, displayPriority)
    ]));

    const detailsColumn = createElement("div", { class: "project-details-column" }, [
      createElement("p", { style: "font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin: 0;" }, "Project Details"),
      ...detailRows,
      createElement("div", { class: "drawer-actions" }, [
        ...(project.status !== "COMPLETE" ? [
          createElement("button", {
            class: "complete-project-btn",
            "data-id": project.id,
            "title": "Complete project"
          }, createElement("span", { class: "material-icons" }, "check_circle"))
        ] : []),
        createElement("button", { 
          class: "edit-project-btn", 
          "data-id": project.id,
          "title": "Edit project"
        }, createElement("span", { class: "material-icons" }, "edit")),
        createElement("button", { 
          class: "delete-project-btn", 
          "data-id": project.id,
          "title": "Delete project"
        }, createElement("span", { class: "material-icons" }, "delete"))
      ])
    ]);

    const itemsList = createElement(
      "ul",
      { class: "drawer-items-list" },
      [
        ...activeItems.map((item) => {
          const priorityClass = item.tier === "TODO" 
            ? `priority-${(typeof item.priority === 'string' ? item.priority : item.priority?.priority || 'none').toLowerCase()}` 
            : "";
          return createElement(
            "li",
            { class: "item-wrapper" },
            [
              createElement(
                "button",
                {
                  class: `drawer-item-btn item-${item.tier.toLowerCase()} ${priorityClass}`,
                  "data-id": item.id,
                  "data-project-id": project.id,
                  "aria-label": `View details for ${item.title}`,
                },
                [
                  createElement("span", { class: "item-title" }, item.title)
                ]
              ),
              createElement("div", {
                class: "drawer-vertical item-detail-drawer",
                "data-item-id": item.id,
              })
            ]
          );
        }),
        // Completed Tasks Trigger
        ...(completedItems.length > 0 ? [
          createElement("li", { class: "item-wrapper" }, [
            createElement("button", {
              class: "drawer-item-btn completed-tasks-btn",
              "data-project-id": project.id,
            }, `Completed Tasks (${completedItems.length})`)
          ])
        ] : []),
        // Dedicated 'Add' button within the horizontal list
        createElement("li", { class: "item-wrapper" }, [
          createElement("button", {
            class: "drawer-item-btn add-item-inline-btn",
            "data-project-id": project.id,
            "aria-label": `Add new item to ${project.title}`
          }, "+ Add")
        ])
      ]
    );

    drawerElement.replaceChildren(detailsColumn, itemsList);

    // Also populate the actual completed drawer (initially hidden)
    const completedContainer = drawerElement.parentElement.querySelector(".drawer-completed");
    if (completedContainer) {
      this.renderCompletedDrawer(completedItems, project.id, completedContainer);
    }
  }

  renderCompletedDrawer(completedItems, projectId, drawerElement) {
    const list = createElement("ul", { class: "drawer-items-list" }, 
      completedItems.map(item => {
        const priorityClass = item.tier === "TODO" 
          ? `priority-${(typeof item.priority === 'string' ? item.priority : item.priority?.priority || 'none').toLowerCase()}` 
          : "";
        return createElement("li", { class: "item-wrapper" }, [
          createElement("button", {
            class: `drawer-item-btn item-completed item-${item.tier.toLowerCase()} ${priorityClass}`,
            "data-id": item.id,
            "data-project-id": projectId,
          }, [
            createElement("span", { class: "item-title" }, item.title)
          ]),
          createElement("div", {
            class: "drawer-vertical item-detail-drawer",
            "data-item-id": item.id,
          })
        ]);
      })
    );
    drawerElement.replaceChildren(list);
  }

  renderVerticalDrawer(project, drawerElement) {
    const note = project.note ? (typeof project.note === 'string' ? project.note : project.note.note) : "";
    const content = createElement("div", { class: "detail-content" }, [
      createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Description"),
        createElement("span", { class: "detail-value" }, project.description || "No description provided.")
      ]),
      createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Due Date"),
        createElement("span", { class: "detail-value" }, project.dueDateTime ? new Date(project.dueDateTime.date).toLocaleString() : "No due date.")
      ]),
      createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Note"),
        createElement("span", { class: "detail-value" }, note || "No notes.")
      ]),
      createElement("button", { 
        class: "add-item-btn", 
        "data-project-id": project.id 
      }, "+ Add Todo or Checklist"),
      createElement("div", { class: "drawer-actions" }, [
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

    drawerElement.replaceChildren(content);
  }

  renderItemDetailDrawer(item, drawerElement, projectId, shouldToggle = true) {
    const getNoteText = (obj) => {
      if (!obj) return "";
      return typeof obj === "string" ? obj : (obj.note || "");
    };
    const getPriorityText = (obj) => {
      if (!obj) return "";
      return typeof obj === "string" ? obj : (obj.priority || "");
    };

    const noteText = getNoteText(item.note);
    const priorityText = getPriorityText(item.priority);
    const isComplete = item.status === "COMPLETE";

    const contentChildren = [];

    // 1. Basic details (Description, Status, Due Date)
    contentChildren.push(
      createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Description"),
        createElement("span", { class: "detail-value" }, item.description || "No description provided.")
      ]),
      createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Status"),
        createElement("span", { class: "detail-value" }, item.status || "ACTIVE")
      ]),
      createElement("div", { class: "detail-row" }, [
        createElement("span", { class: "detail-label" }, "Due Date"),
        createElement("span", { class: "detail-value" }, item.dueDateTime ? new Date(item.dueDateTime.date || item.dueDateTime).toLocaleString() : "No due date.")
      ])
    );

    // 2. Note and Priority (for Todos)
    if (item.tier === "TODO") {
      contentChildren.push(
        createElement("div", { class: "detail-row" }, [
          createElement("span", { class: "detail-label" }, "Note"),
          createElement("span", { class: "detail-value" }, noteText || "No notes.")
        ]),
        createElement("div", { class: "detail-row" }, [
          createElement("span", { class: "detail-label" }, "Priority"),
          createElement("span", { 
            class: `priority-tag priority-${(priorityText || 'none').toString().toLowerCase()}` 
          }, priorityText || "NONE")
        ])
      );
    }

    // 3. Checklist Items and Add Button (for Checklists)
    if (item.tier === "CHECKLIST") {
      if (item.items && item.items.length > 0) {
        contentChildren.push(createElement("h5", { style: "margin: 1rem 0 0.5rem 0; color: var(--text-secondary);" }, "Items"));
        const checkItemsList = createElement("ul", { 
          class: "check-items-list",
          style: "list-style: none; padding: 0; margin-bottom: 1.5rem;" 
        }, 
          item.items.map(checkItem => 
            createElement("li", { 
              class: "check-item-wrapper",
              style: "margin-bottom: 0.5rem;"
            }, [
              createElement("button", {
                class: `drawer-item-btn check-item-btn ${checkItem.status === 'COMPLETE' ? 'item-completed' : ''}`,
                "data-id": checkItem.id,
                "data-checklist-id": item.id,
                "data-project-id": projectId,
                style: "width: 100%; text-align: left;"
              }, checkItem.title),
              createElement("div", {
                class: "drawer-vertical item-detail-drawer check-item-detail-drawer",
                "data-item-id": checkItem.id,
              })
            ])
          )
        );
        contentChildren.push(checkItemsList);
      }

      contentChildren.push(
        createElement("button", {
          class: "add-checkitem-btn",
          "data-checklist-id": item.id,
          "data-project-id": projectId
        }, "+ Add Check Item")
      );
    }

    const actionButtons = [];
    if (!isComplete) {
      actionButtons.push(
        createElement("button", {
          class: "complete-task-btn",
          "data-id": item.id,
          "data-project-id": projectId,
          "title": "Complete task"
        }, createElement("span", { class: "material-icons" }, "check_circle"))
      );
    } else {
      actionButtons.push(
        createElement("button", {
          class: "restore-task-btn",
          "data-id": item.id,
          "data-project-id": projectId,
          "title": "Restore task"
        }, createElement("span", { class: "material-icons" }, "settings_backup_restore"))
      );
    }
    actionButtons.push(
      createElement("button", { 
        class: "edit-item-btn", 
        "data-id": item.id,
        "data-project-id": projectId,
        "title": "Edit task"
      }, createElement("span", { class: "material-icons" }, "edit")),
      createElement("button", { 
        class: "delete-item-btn", 
        "data-id": item.id,
        "data-project-id": projectId,
        "title": "Delete task"
      }, createElement("span", { class: "material-icons" }, "delete"))
    );

    contentChildren.push(createElement("div", { class: "drawer-actions" }, actionButtons));

    const content = createElement("div", { class: "detail-content" }, contentChildren);
    drawerElement.replaceChildren(content);
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

  closeAllDrawers(projectId) {
    const container = this.root.querySelector(`.project-container[data-id="${projectId}"]`);
    container.querySelectorAll(".open").forEach(el => el.classList.remove("open"));
  }
}
