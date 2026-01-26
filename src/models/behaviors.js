// INFO: define standalone functions
// *  functions should:
// *    accept an object
// *    attach properties/methods to it
// TODO: write addStatus
// TODO: write addNote
// TODO: write addChecklist
// TODO: write addDueDate
// TODO: write addDueTime
// TODO: write addCheckItem
console.log("log");
//
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

const addStatus = (object) => {
  let _status = "";
  let reason = "blocked";
  if (_status === "blocked") {
    const _statusBlocked = "blocked" + "by" + `${reason}`;
  } else if (
    _status !== "complete" ||
    _status !== "spotlight" ||
    _status !== "active" ||
    _status !== "inactive" ||
    _status !== _statusBlocked
  ) {
    console.error("invalid status");
    return;
  } else {
    return;
  }
  Object.defineProperties(object, {
    status: {
      get() {
        return _status;
      },
      set(string) {
        _status = string;
      },
      enumerable: true,
      configurable: true,
    },
    addStatus: {
      value: function (string) {
        this.status = string;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
};

const addNote = (object) => {
  let _note = "";
  Object.defineProperties(object, {
    note: {
      get() {
        return _note;
      },
      set(string) {
        _note = string;
      },
      enumerable: true,
      configurable: true,
    },
    addStatus: {
      value: function (string) {
        this.note = string;
      },
      writeable: true,
      enumerable: false,
      configurable: true,
    },
  });
};

export { addPriority, addDescription, addStatus, addNote };
