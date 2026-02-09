// NOTE: new storage class goes here
export default class StorageService {
  constructor(key) {
    this.key = key;
    const dateObj = {
      date: new Date(String),
      granularity: "FULL",
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
    const Project = {
      description: String,
      dueDateTime: dateObj,
      groupId: String,
      id: String,
      note: noteObj,
      priority: priorityObj,
      status: String,
      tier: String,
      title: String,
    };
  }
}

// TEST
const dateObj = {
  date: "2023-01-13T21:52:03.392Z",
  granularity: "FULL",
};
const dueDate = new Date("2023-01-13T21:52:03.392Z");
const sample = new StorageService();
console.log(sample);
