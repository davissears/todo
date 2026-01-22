// INFO: define standalone functions
// *  functions should:
// *    accept an object
// *    attach properties/methods to it

// declare named implicit return arrow function
const addPriority = (object) => {
	// declare method is function
	//    accepts arg `level`
	Object.defineProperty(object, "addPriority", {
		value: function (level) {
			// this instance of `priority` assigned value of `level` arg passed in
			this.priority = level;
		},
		writable: true,
		enumerable: false,
		configurable: true,
	});
	// implicitly return the object passed in
	return object;
};

export { addPriority };
