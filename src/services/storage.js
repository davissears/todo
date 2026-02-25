import Priority from "../model/objects/properties/priority.js";
import Note from "../model/objects/properties/note.js";
import Project from "../model/objects/project.js";
import CheckItem from "../model/objects/checkItem.js";
import Checklist from "../model/objects/checklist.js";

// NOTE: new storage class goes here
export default class StorageService {
  constructor(key) {
    this.key = key;
    const dateObj = {
      date: new Date(String),
    };
    // ! TEMPLATES

    const noteObj = {
      groupId: String,
      id: String,
      note: String,
    };

    const priorityObj = {
      groupId: String,
      id: String,
      priority: String,
    };
    const project = {
      description: String,
      dueDateTime: dateObj,
      groupId: String,
      id: String,
      note: noteObj || undefined, //test this
      priority: priorityObj || undefined, //test this
      status: String,
      tier: String,
      title: String,
    };

    const todo = {
      description: String,
      dueDateTime: dateObj,
      groupId: String,
      id: String,
      note: noteObj || undefined, //test this
      priority: priorityObj || undefined, //test this
      status: String,
      tier: String,
      title: String,
    };

    const checklist = {
      description: String,
      dueDateTime: dateObj,
      groupId: String,
      id: String,
      note: noteObj || undefined, //test this
      priority: priorityObj || undefined, //test this
      status: String,
      tier: String,
      title: String,
    };
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
    return {
      date: new Date(storedObj.date),
    };
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
    //create instance
    const instance = new Priority(storedObj.priority, storedObj.groupId);
    //overwrite id
    instance.id = storedObj.id;
    return instance;
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
    const instance = new Note(storedObj.note, storedObj.groupId);
    instance.id = storedObj.id;
    return instance;
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

  // ?: does it make sense to write a method to call methods for objects in `items`?
  // NOTE: PRO: removes multiple lines of code
  // NOTE: CON: adds complexity & dependancy on other function
  // EXAMPLE: items.forEach(obj) => findTier(obj)
  // findTier(obj) {
  //  if (obj.tier ===  todo) {
  //    deserializeTodo()
  //  }
  // }
  serializeProject(obj) {
    return {
      items: this.serializeCheckItem,
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
  deserializeProject(storedObj) {
    const instance = new Project(storedObj.title);
    instance.items = storedObj.items;
    instance.title = storedObj.title;
    instance.id = storedObj.id;
    instance.groupId = storedObj.groupId;
    instance.description = storedObj.description;
    instance.status = storedObj.status;

    if (storedObj.note) {
      instance.note = this.deserializeNoteObj(storedObj.note);
    }

    if (storedObj.priority) {
      instance.priority = this.deserializePriorityObj(storedObj.priority);
    }
    if (storedObj.dueDateTime) {
      const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
      instance.dueDateTime = dueDateTimeData.date;
    }
    return instance;
  }
}

// TEST
// --- VERIFICATION SUITE ---
// 1. create object
const storage = new StorageService();
// const project = new Project("!!! PROJECT !!!");
// const original = new CheckItem("!!!SAMPLE CHECK ITEM!!!");
const original = new Checklist("!!!SAMPLE CHECKLIST!!!");
const originalItem = new CheckItem("!!!SAMPLE CHECKITEM!!!");
original.items = [originalItem];
original.note = "Critical metadata about the task";
original.priority = "EMERGENCY";
original.description = "::: DESCRIPTION :::";
original.status = "ACTIVE";
original.dueDateTime = `2027-02-20T22:07:50.128Z`;
console.log(":::CHECKLIST:::", original);
// 2. Perform the Round Trip
const serialized = storage.serializeChecklist(original);
console.log(
  ":::SERIALIZED:::CHECKLIST:::",
  serialized,
  ":::SERIALIZED:::ITEMS:::",
  serialized.items,
);
const rehydrated = storage.deserializeChecklist(serialized);
console.log(
  ":::REHYDRATED:::CHECKLIST:::",
  rehydrated,
  ":::REHYDRATED:::ITEMS:::",
  rehydrated.items,
);

console.log("\n--- STARTING ROUND TRIP AUDIT ---");

// console.log("\n--- DIAGNOSTIC DATA ---");
// console.log("Original ID:  ", original.id);
// console.log("Rehydrated ID:", rehydrated.id);
// console.log("Note ID:      ", rehydrated.note.id);

// 3. Helper for clean output
function verify(label, result) {
  console.log(`${result ? "✅ PASS" : "❌ FAIL"} | ${label}`);
}
// Date Object (comparing millisecond timestamps)
verify(
  "Date Match",
  original.dueDateTime.date.getTime() === rehydrated.dueDateTime.date.getTime(),
);
// Core Properties
verify("Title Match", original.title === rehydrated.title);
verify("Description Match", original.description === rehydrated.description);
verify("ID Preserved", original.id === rehydrated.id);
verify("Group ID Preserved", original.groupId === rehydrated.groupId);
verify("tier match", original.tier === rehydrated.tier);
verify(
  "children match",
  original.items.length === rehydrated.items.length &&
    original.items[0].id === rehydrated.items[0].id,
);
