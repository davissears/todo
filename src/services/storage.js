import Priority from "../model/objects/properties/priority.js";
import Note from "../model/objects/properties/note.js";
import Project from "../model/objects/project.js";
import CheckItem from "../model/objects/checkItem.js";
import Checklist from "../model/objects/checklist.js";
import Todo from "../model/objects/todo.js";

// NOTE: new storage class goes here
export default class StorageService {
  constructor(key) {
    this.key = key;
  }

  save(projects) {
    // check if we are in a browser environment
    if (typeof localStorage === "undefined") return;

    const serialized = projects.map((project) =>
      this.serializeProject(project),
    );
    localStorage.setItem(this.key, JSON.stringify(serialized));
  }

  load() {
    // return an empty array if localStorage isn't available
    if (typeof localStorage === "undefined") return [];

    const data = JSON.parse(localStorage.getItem(this.key) || "[]");
    return data.map((project) => this.deserializeProject(project));
  }

  serializeDateObj(obj) {
    if (obj && obj.date instanceof Date && !isNaN(obj.date.getTime())) {
      return {
        date: obj.date.toISOString(),
      };
    }
    return undefined;
  }

  deserializeDateObj(storedObj) {
    if (storedObj && storedObj.date) {
      const date = new Date(storedObj.date);
      if (!isNaN(date.getTime())) {
        return { date };
      }
    }
    return undefined;
  }

  serializePriorityObj(obj) {
    if (obj !== undefined) {
      return {
        groupId: obj.groupId,
        prop: obj.prop,
        id: obj.id,
        priority: obj.priority,
      };
    }
    return;
  }
  deserializePriorityObj(storedObj) {
    if (storedObj !== undefined) {
      const instance = new Priority(storedObj.priority, storedObj.groupId);
      //overwrite id
      instance.id = storedObj.id;
      return instance;
    }
    return;
  }

  serializeNoteObj(obj) {
    if (obj !== undefined)
      return {
        groupId: obj.groupId,
        prop: obj.prop,
        id: obj.id,
        note: obj.note,
      };
    return;
  }
  deserializeNoteObj(storedObj) {
    if (storedObj !== undefined) {
      const instance = new Note(storedObj.note, storedObj.groupId);
      instance.id = storedObj.id;
      return instance;
    }
    return;
  }

  deserializeItemsByTier(items, deserializers) {
    return items.map((item) => {
      if (Object.hasOwn(deserializers, item.tier)) {
        return deserializers[item.tier](item);
      }
      return item;
    });
  }

  hydrateJotFields(instance, storedObj) {
    instance.description = storedObj.description;
    instance.groupId = storedObj.groupId;
    instance.id = storedObj.id;
    instance.status = storedObj.status;
    this.hydrateDueDateTime(instance, storedObj);
  }

  hydrateDueDateTime(instance, storedObj) {
    if (storedObj.dueDateTime === undefined) return;

    const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
    if (dueDateTimeData) {
      instance.dueDateTime = dueDateTimeData.date;
    }
  }

  hydrateNoteAndPriority(instance, storedObj) {
    if (storedObj.note !== undefined) {
      instance.note = this.deserializeNoteObj(storedObj.note);
    }
    if (storedObj.priority !== undefined) {
      instance.priority = this.deserializePriorityObj(storedObj.priority);
    }
  }

  serializeCheckItem(obj) {
    if (obj !== undefined) {
      return {
        title: obj.title,
        tier: obj.tier,
        id: obj.id,
        groupId: obj.groupId,
        description: obj.description,
        status: obj.status,
        dueDateTime: this.serializeDateObj(obj.dueDateTime),
      };
    }
    return;
  }
  deserializeCheckItem(storedObj) {
    if (storedObj !== undefined) {
      const instance = new CheckItem(storedObj.title);
      this.hydrateJotFields(instance, storedObj);
      return instance;
    }
    return;
  }

  serializeChecklist(obj) {
    if (obj !== undefined) {
      return {
        items: obj.items.map((item) => {
          if (item.tier === "CHECKITEM") return this.serializeCheckItem(item);
          return item; // Handle other types as needed
        }),
        description: obj.description,
        dueDateTime: this.serializeDateObj(obj.dueDateTime),
        groupId: obj.groupId,
        id: obj.id,
        status: obj.status,
        tier: obj.tier,
        title: obj.title,
      };
    }
    return;
  }
  deserializeChecklist(storedObj) {
    if (storedObj !== undefined) {
      const instance = new Checklist(storedObj.title);
      instance.items = this.deserializeItemsByTier(storedObj.items, {
        CHECKITEM: (item) => this.deserializeCheckItem(item),
      });
      this.hydrateJotFields(instance, storedObj);
      return instance;
    }
    return;
  }

  serializeItemsByTier(items, serializers) {
    return items.map((item) => {
      if (Object.hasOwn(serializers, item.tier)) {
        return serializers[item.tier](item);
      }
      return item;
    });
  }

  serializeContainerWithItems(obj, items) {
    return {
      items,
      note: this.serializeNoteObj(obj.note),
      priority: this.serializePriorityObj(obj.priority),
      title: obj.title,
      tier: obj.tier,
      id: obj.id,
      groupId: obj.groupId,
      description: obj.description,
      status: obj.status,
      dueDateTime: this.serializeDateObj(obj.dueDateTime),
    };
  }

  serializeTodo(obj) {
    if (obj !== undefined) {
      const items = this.serializeItemsByTier(obj.items, {
        CHECKLIST: (item) => this.serializeChecklist(item),
      });
      return this.serializeContainerWithItems(obj, items);
    }
  }

  deserializeTodo(storedObj) {
    const instance = new Todo(storedObj.title);
    instance.items = this.deserializeItemsByTier(storedObj.items, {
      CHECKLIST: (item) => this.deserializeChecklist(item),
    });
    this.hydrateNoteAndPriority(instance, storedObj);
    this.hydrateJotFields(instance, storedObj);
    return instance;
  }

  // ?: does it make sense to write a method to call methods for objects in `items`?
  // NOTE: PRO: removes multiple lines of code
  // NOTE: CON: adds complexity & dependancy on other function

  serializeProject(obj) {
    if (obj !== undefined) {
      const items = this.serializeItemsByTier(obj.items, {
        TODO: (item) => this.serializeTodo(item),
        CHECKLIST: (item) => this.serializeChecklist(item),
      });
      return this.serializeContainerWithItems(obj, items);
    }
  }
  deserializeProject(storedObj) {
    const instance = new Project(storedObj.title);
    instance.items = this.deserializeItemsByTier(storedObj.items, {
      TODO: (item) => this.deserializeTodo(item),
      CHECKLIST: (item) => this.deserializeChecklist(item),
    });
    this.hydrateJotFields(instance, storedObj);
    this.hydrateNoteAndPriority(instance, storedObj);
    return instance;
  }
}
