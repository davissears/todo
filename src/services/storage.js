import Priority from "../model/objects/properties/priority.js";
import Note from "../model/objects/properties/note.js";
import Project from "../model/objects/project.js";

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

  serializeProject(obj) {
    return {
      items: obj.items,
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

    // FIX: rehydrated prop id's should match the original

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

const storage = new StorageService();

// 1. Create a complex Project
const original = new Project("Master Task");
original.description = "This is a detailed description";
original.note = "Critical metadata about the task";
original.priority = "EMERGENCY";
original.dueDateTime = "2026-12-25";

// 2. Perform the Round Trip
const serialized = storage.serializeProject(original);
const rehydrated = storage.deserializeProject(serialized);

// 3. Helper for clean output
function verify(label, result) {
  console.log(`${result ? "✅ PASS" : "❌ FAIL"} | ${label}`);
}

console.log("\n--- STARTING ROUND TRIP AUDIT ---");

// Core Properties
verify("Title Match", original.title === rehydrated.title);
verify("Description Match", original.description === rehydrated.description);
verify("Project ID Preserved", original.id === rehydrated.id);
verify("Group ID Preserved", original.groupId === rehydrated.groupId);

// Note Object
verify("Note Content Match", original.note.note === rehydrated.note.note);
verify("Note ID Preserved", original.note.id === rehydrated.note.id);

// Priority Object
verify(
  "Priority Level Match",
  original.priority.priority === rehydrated.priority.priority,
);
verify(
  "Priority ID Preserved",
  original.priority.id === rehydrated.priority.id,
);

// Date Object (comparing millisecond timestamps)
verify(
  "Date Match",
  original.dueDateTime.date.getTime() === rehydrated.dueDateTime.date.getTime(),
);

console.log("\n--- DIAGNOSTIC DATA ---");
console.log("Original ID:  ", original.id);
console.log("Rehydrated ID:", rehydrated.id);
console.log("Note ID:      ", rehydrated.note.id);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// console.log(sampleData);
// const serial = storage.serializeNoteObj(sampleData);
// console.log(":::serial:::", serial);
// console.log(":::serial/deserial", storage.deserializeNoteObj(serial));

// console.log(":::INPUT:::", sampleData);
// console.log(":::SERIALIZE:::", storage.serializePriorityObj(sampleData));
// console.log(
//   ":::SERIAL/DESERIAL",
//   storage.deserializePriorityObj(storage.serializePriorityObj(sampleData)),
// );
