export class Todo {
  #title;
  #priority;
  #description;
  #dueDate;
  #dueTime;
  #note;
  constructor(title) {
    this.#title = title;
  }
}
