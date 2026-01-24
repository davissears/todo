export class Jot {
	#title;
	// #priority;
	// #description;
	// #dueDate;
	// #dueTime;
	// #note;
	// #projectId;
	// #orderId;
	// specifies object as project, todo, checklist, or check-item
	// #tier;
	constructor(title) {
		this.#title = title;
	}

	get title() {
		return this.#title;
	}

	set title(title) {
		this.#title = title;
	}

	toJSON() {
		// instantiate new object as return value
		// to return
		return {
			// object key `title` has value of:
			// this private instance of title
			title: this.#title,
			// spread/copy all properties of:
			// this instance into object
			...this,
		};
	}

	// this class has:
	//  function that accepts jsonified objects
	static fromJSON(data) {
		// retrun value is: new instance of this class
		const jot = new Jot(data.title);
		// assign properties of jsonifies object:
		//  to new instance
		Object.assign(jot, data);
		return jot;
	}
}
