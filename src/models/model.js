import { Todo } from "./todo";

export default class Model {
  constructor() {
    this.todos = [];
  }

  createTodo(title) {
    const todo = new Todo(title);
    this.todos.push(todo);
  }
}
