// @ts-nocheck
export default class StorageService {
	// each instance of storage will have a `key` property
	constructor(key) {
		this.key = key;
	}

	save(data) {
		try {
			localStorage.setItem(this.key, JSON.stringify(data));
		} catch (e) {
			console.error("Error saving to localStorage", e);
		}
	}

	load() {
		try {
			const data = localStorage.getItem(this.key);
			return data ? JSON.parse(data) : null;
		} catch (e) {
			console.error("Error loading from localStorage", e);
			return null;
		}
	}
}
