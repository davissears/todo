// INFO: define standalone functions
// *  functions should:
// *    accept an object
// *    attach properties/methods to it

const addPriority = (object, level) => {
  object.priority = level;
  return object;
};

export { addPriority };
