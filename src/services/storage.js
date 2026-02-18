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
      instance.dueDateTime = dueDateTimeData.dueDateTime;
    }
    return instance;
  }
}

// TEST

const storage = new StorageService();
// const sampleNote = new Note(":::THIS IS A NOTE:::", "6767");
// console.log(":::NOTE", sampleNote);
// const samplePriority = new Priority("HIGH", "6767");
// console.log(":::PRIORITY:::", samplePriority);

const sampleData = new Project("::: PROJECT OBJECT");
console.log(":::PROJECT:::", sampleData);

sampleData.note = "::: TEST NOTE SETTER :::";
console.log(":::SAMPLENOTE:::", sampleData.note);

sampleData.priority = "HIGH";
console.log(":::SAMPLEPRIORITY:::", sampleData.priority);
console.log(":::SERIALIZE:::", storage.serializeProject(sampleData));
console.log(
  ":::DESERIAL",
  storage.deserializeProject(storage.serializeProject(sampleData)),
);
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
