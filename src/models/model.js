import { Todo } from "./todo.js";

export default class Model {
  constructor() {
    this.todos = [];
  }

  createTodo(title) {
    const todo = new Todo(title);
    this.todos.push(todo);
  }
}
