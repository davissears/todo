// INFO: define standalone functions
// *  functions should:
// *    accept an object
// *    attach properties/methods to it

// composes `priority` property onto object
const addPriority = (object) => {
  // private variable scoped to this specific object instance
  let _priority = "Normal"; // property value is `normal` unless specified

  Object.defineProperties(object, {
    // data property
    priority: {
      // gets priority from decorated object
      get() {
        return _priority;
      },

      // sets priority of decorated object
      set(level) {
        // validation logic can go here
        _priority = level;
      },
      enumerable: true, // data should be visible (for JSON/Loops)
      configurable: true,
    },
    //call example: myTodo.priority = "High";

    // helper method:
    addPriority: {
      value: function (level) {
        this.priority = level;
      },
      writable: true,
      enumerable: false, // keeps function hidden
      configurable: true,
    },
  });

  return object;

  // call example: myTodo.addPriority("Low");
};

const addDescription = (object) => {
  let _description = "";

  Object.defineProperties(object, {
    // data property
    description: {
      get() {
        return _description;
      },
      set(string) {
        _description = string;
      },
      enumerable: true,
      configurable: true,
    },

    addDescription: {
      value: function (string) {
        this.description = string;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
};

export { addPriority };
