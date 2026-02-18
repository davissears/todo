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
    instance.id = storedObj.id;
    instance.groupId = storedObj.groupId; 
    // FIX: rehydrated prop id's should match the original

    if (storedObj.note) {
      const noteData = this.deserializeNoteObj(storedObj.note);
      instance.note = noteData.note;
    }

    if (storedObj.priority) {
      const priorityData = this.deserializePriorityObj(storedObj.priority);
      instance.priority = priorityData.priority;
    }
    if (storedObj.dueDateTime) {
      const dueDateTimeData = this.deserializeDateObj(storedObj.dueDateTime);
      instance.dueDateTime = dueDateTimeData.date;
    }
    return instance;
  }
}

// TEST
//storage init
const storage = new StorageService();
//project init
const sampleData = new Project("::: PROJECT OBJECT");
// set note
sampleData.note = "::: TEST NOTE SETTER :::";
console.log(":::SAMPLENOTE:::", sampleData.note);
// set priority
sampleData.priority = "HIGH";
console.log(":::SAMPLEPRIORITY:::", sampleData.priority);
//set dueDateTime
sampleData.dueDateTime = "5/5/2027";
console.log(":::SAMLEDUEDATETIME", sampleData.dueDateTime);
//serialize
console.log(":::SERIALIZE:::", storage.serializeProject(sampleData));
// serialize & deserialize
console.log(
  ":::DESERIAL",
  storage.deserializeProject(storage.serializeProject(sampleData)),
);
// test after rehydration
// 1. setup original
const original = new Project("Test Project");
original.note = "Original Note";
original.dueDateTime = "2027-05-05";

// 2. round trip
const serialized = storage.serializeProject(original);
const rehydrated = storage.deserializeProject(serialized); // Capture the NEW object

// 3. The "Truth" Tests
console.log("--- ROUND TRIP VERIFICATION ---");

// Does the title match?
console.log("Title Match:", original.title === rehydrated.title);

// Does the note match?
console.log("Note Match:", original.note === rehydrated.note);

// CRITICAL: Does the ID match?
// (If this is false, your storage will create duplicates)
console.log("ID Match:", original.id === rehydrated.id);

// 4. Debugging the objects side-by-side
console.log("Original ID:", original.id);
console.log("Rehydrated ID:", rehydrated?.id);
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
