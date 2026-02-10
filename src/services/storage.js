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

  deserializeDateObj(storedItem) {
    return {
      date: new Date(storedItem.date),
    };
  }
}

// TEST

const dueDateTime = { date: new Date("2027-01-13T21:52:03.392Z") };
const storage = new StorageService();
console.log(":::DUEDATETIME:::", dueDateTime);
console.log(":::SERIALIZE:::", storage.serializeDateObj(dueDateTime));
console.log(
  ":::SERIAL/DESERIAL",
  storage.deserializeDateObj(storage.serializeDateObj(dueDateTime)),
);
