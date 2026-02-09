class StorageService {
  // each instance of storage will have a `key` property
  constructor(key) {
    this.key = key;
  }

  //NOTE: serialize
  save(data) {
    try {
      // key=`this` instance: value=all data from this instanse
      // write to storage as json string
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  }

  // NOTE: deserialize
  load() {
    try {
      // get `this` data from localStorage
      const data = localStorage.getItem(this.key);
      // if `this` data exists
      if (data) {
        // parse from json to object
        return JSON.parse(data);
      }
      // or return nothing
      return null;
    } catch (e) {
      console.error("Error loading from localStorage", e);
      return null;
    }
  }
}

export default StorageService;
