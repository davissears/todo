import Priority from "../model/objects/properties/priority.js";

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
    return {
      date: obj.date.toISOString(),
    };
  }
  deserializeDateObj(storedObj) {
    return {
      date: new Date(storedObj.date),
    };
  }

  serializePriorityObj(obj) {
    return {
      groupId: obj.groupId,
      prop: obj.prop,
      id: obj.id,
      priority: obj.priority,
    };
  }
  deserializePriorityObj(storedObj) {
    //create instance
    const instance = new Priority(storedObj.priority, storedObj.groupId);
    //overwrite id
    instance.id = storedObj.id;
    return instance;
  }
}

// TEST

const storage = new StorageService();

const sampleData = new Priority("HIGH", "6767");
console.log(":::INPUT:::", sampleData);
console.log(":::SERIALIZE:::", storage.serializePriorityObj(sampleData));
console.log(
  ":::SERIAL/DESERIAL",
  storage.deserializePriorityObj(storage.serializePriorityObj(sampleData)),
);
