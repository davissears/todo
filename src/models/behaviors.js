import { format, parse, isValid, startOfDay } from "date-fns";
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
  let _status = "active";

  Object.defineProperties(object, {
    status: {
      get() {
        return _status;
      },
      set(string) {
        const isBlocked = string.startsWith("blocked:");
        const validStatuses = [
          "",
          "complete",
          "spotlight",
          "active",
          "inactive",
        ];

        if (validStatuses.includes(string) || isBlocked) {
          _status = string;
        } else {
          console.error(`invalid status: ${string}`);
        }
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
    addNote: {
      value: function (string) {
        this.note = string;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
};

const addDueDate = (object) => {
  let _dueDate = format(new Date(), "MM/dd/yyyy");
  Object.defineProperties(object, {
    dueDate: {
      get() {
        return _dueDate;
      },
      set(string) {
        // try to parse as dd/mm/yyyy
        let parsedDate = parse(string, "MM/dd/yyyy", new Date());

        // if invalid, try to parse as standard date
        if (!isValid(parsedDate)) {
          parsedDate = new Date(string);
        }

        if (isValid(parsedDate)) {
          _dueDate = format(parsedDate, "MM/dd/yyyy");
        } else {
          console.error("invalid date format: please use dd/mm/yyyy");
        }
      },
      enumerable: true,
      configurable: true,
    },
    addDueDate: {
      value: function (string) {
        this.dueDate = string;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
};


const addDueTime = (object) => {
  let _dueTime = format(new Date(), "hh:mm a");
  const _dueDate = object.dueDate;
  Object.defineProperties(object, {
    dueTime: {
      get() {
        return _dueTime;
      },
      set(string) {
        let parsedTime = parse(string, "hh:mm a", new Date());

        if (!isValid(parsedTime)) {
          parsedTime = new Date(string);
        }

        if (isValid(parsedTime)) {
          _dueTime = format(parsedTime, "hh:mm a");
        } else {
          console.error("invalid time format please use HH:mm AM/PM");
        }
      },
      enumerable: true,
      configurable: true,
    },
    addDueTime: {
      value: function (string) {
        this.dueTime = string;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
};
export {
  addPriority,
  addDescription,
  addStatus,
  addNote,
  addDueDate,
  addDueTime,
};
