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
    const serialized = projects.map((project) =>
      this.serializeProject(project),
    );
    localStorage.setItem(this.key, JSON.stringify(serialized));
  }

  load() {
    const data = JSON.parse(localStorage.getItem(this.key) || "[]");
    return data.map((project) => this.deserializeProject(project));
  }

  serializeDateObj(obj) {
    // TEST: what is obj?
    console.log(
      ":::LOGSTART:::serializeDateObj:::OBJ:::obj-is:",
      obj,
      ":::LOGEND:::",
    );
    if (obj !== undefined)
      return {
        date: obj.date.toISOString(),
      };
    return;
  }
  deserializeDateObj(storedObj) {
    if (storedObj !== undefined)
      return {
        date: new Date(storedObj.date),
      };
    return;
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
      instance.id = storedObj.id;
      instance.groupId = storedObj.groupId;
      instance.description = storedObj.description;
      instance.status = storedObj.status;

      if (storedObj.dueDateTime) {
        const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
        instance.dueDateTime = dueDateTimeData.date;
      }
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
      instance.items = storedObj.items.map((item) => {
        if (item.tier === "CHECKITEM") return this.deserializeCheckItem(item);
        return item; // handle other types as needed
      });
      instance.description = storedObj.description;
      instance.dueDateTime = this.deserializeDateObj(storedObj.dueDateTime);
      instance.groupId = storedObj.groupId;
      instance.id = storedObj.id;
      instance.status = storedObj.status;
      if (storedObj.dueDateTime) {
        const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
        instance.dueDateTime = dueDateTimeData.date;
      }
      return instance;
    }
    return;
  }

  serializeTodo(obj) {
    if (obj !== undefined) {
      return {
        items: obj.items.map((item) => {
          if (item.tier === "CHECKLIST") return this.serializeChecklist(item);
          return item;
        }),
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
  }

  deserializeTodo(storedObj) {
    const instance = new Todo(storedObj.title);
    instance.items = storedObj.items.map((item) => {
      if (item.tier === "CHECKLIST") return this.deserializeChecklist(item);
      return item;
    });
    if (storedObj.note !== undefined) {
      instance.note = this.deserializeNoteObj(storedObj.note);
    }
    if (storedObj.priority !== undefined) {
      instance.priority = this.deserializePriorityObj(storedObj.priority);
    }
    instance.description = storedObj.description;
    instance.dueDateTime = this.deserializeDateObj(storedObj.dueDateTime);
    instance.groupId = storedObj.groupId;
    instance.id = storedObj.id;
    instance.status = storedObj.status;
    if (storedObj.dueDateTime !== undefined) {
      const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
      instance.dueDateTime = dueDateTimeData.date;
    }
    return instance;
  }

  // ?: does it make sense to write a method to call methods for objects in `items`?
  // NOTE: PRO: removes multiple lines of code
  // NOTE: CON: adds complexity & dependancy on other function

  serializeProject(obj) {
    if (obj !== undefined) {
      return {
        items: obj.items.map((item) => {
          if (item.tier === "TODO") return this.serializeTodo(item);
          if (item.tier === "CHECKLIST") return this.serializeChecklist(item);
          return item;
        }),
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
  }
  deserializeProject(storedObj) {
    const instance = new Project(storedObj.title);
    instance.items = storedObj.items.map((item) => {
      if (item.tier === "TODO") return this.deserializeTodo(item);
      if (item.tier === "CHECKLIST") return this.deserializeChecklist(item);
      return item;
    });
    instance.title = storedObj.title;
    instance.id = storedObj.id;
    instance.groupId = storedObj.groupId;
    instance.description = storedObj.description;
    instance.status = storedObj.status;

    if (storedObj.note !== undefined) {
      instance.note = this.deserializeNoteObj(storedObj.note);
    }

    if (storedObj.priority !== undefined) {
      instance.priority = this.deserializePriorityObj(storedObj.priority);
    }
    if (storedObj.dueDateTime !== undefined) {
      const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
      instance.dueDateTime = dueDateTimeData.date;
    }
    return instance;
  }
}

// // TEST
// // --- VERIFICATION SUITE ---
// // 1. create object
// const storage = new StorageService();
// const original = new Project("!!! PROJECT !!!");
// const originalT = new Todo("!!!SAMPLE TODO!!!");
// const originalCL = new Checklist("!!!SAMPLE CHECEKLIST!!!");
// originalCL.description = "is a checklist";
// originalCL.status = "ACTIVE";
// originalCL.dueDateTime = `2027-02-20T22:07:50.128Z`;
// originalCL.priority = "EMERGENCY";
// original.items = [originalCL, originalT];
// const item1 = new CheckItem("item1");
// const item2 = new CheckItem("item2");
// const item3 = new CheckItem("item3");
// originalCL.items = [item1, item2, item3];
// original.note = "Critical metadata about the task";
// original.priority = "EMERGENCY";
// original.description = "::: DESCRIPTION :::";
// original.status = "ACTIVE";
// original.dueDateTime = `2027-02-20T22:07:50.128Z`;
// console.log(":::PARENT:::", original);
// // 2. Perform the Round Trip
// const serialized = storage.serializeProject(original);
// console.log(
//   ":::SERIALIZED:::PARENT:::",
//   serialized,
//   ":::SERIALIZED:::CHILD:::",
//   serialized.items,
// );
// const rehydrated = storage.deserializeProject(serialized);
// console.log(
//   ":::REHYDRATED:::PARENT:::",
//   rehydrated,
//   ":::REHYDRATED:::CHILD:::",
//   rehydrated.items,
// );

// console.log("\n--- STARTING ROUND TRIP AUDIT ---");

// console.log("\n--- DIAGNOSTIC DATA ---");
// console.log("Original ID:  ", original.id);
// console.log("Rehydrated ID:", rehydrated.id);

// // 3. Helper for clean output
// function verify(label, result) {
//   console.log(`${result ? "✅ PASS" : "❌ FAIL"} | ${label}`);
// }
// // Date Object (comparing millisecond timestamps)
// verify(
//   "Date Match",
//   original.dueDateTime.date.getTime() === rehydrated.dueDateTime.date.getTime(),
// );
// // Core Properties
// verify("Title Match", original.title === rehydrated.title);
// verify("Description Match", original.description === rehydrated.description);
// verify("ID Preserved", original.id === rehydrated.id);
// verify("Group ID Preserved", original.groupId === rehydrated.groupId);
// verify("tier match", original.tier === rehydrated.tier);
// verify(
//   "children match",
//   original.items.length === rehydrated.items.length &&
//     original.items[0].id === rehydrated.items[0].id,
// );
