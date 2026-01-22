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
		return {
			title: this.#title,
			//    if(priority) {
			//      priority: this.priority,
			// },
			...this,
		};
	}

	static fromJSON(data) {
		const jot = new Jot(data.title);
		// restory properties
		Object.assign(jot, data);
		return jot;
	}
}
