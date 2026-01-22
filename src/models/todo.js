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

	// NOTE: commented out during refactor
	// startProject(title, description) {
	// 	this.#title = title;
	// 	this.#description = description;
	// 	this.#projectId = Math.random().toString(36).substring(2, 9);
	// 	this.#tier = "project";
	// }

	get title() {
		return this.#title;
	}

	set title(title) {
		this.#title = title;
	}

	toJSON() {
		return {
			title: this.#title,
			...this,
		};
	}

	static fromJSON(data) {
		return new Jot(data.title);
	}
}
