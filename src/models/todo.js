export class Jot {
  #id = crypto.randomUUID();
  #tier = "";
  constructor(tier, title) {
    this.title = title;
  }
  get id() {
    return this.#id;
  }

  // get priority() {
  //   return this.priority;
  // }
}
// NOTE: testing
// object should be extensible to all other like objects
const sampleItem = new Jot("sample", "Walk dog");
console.log("new jot", sampleItem);
// test:pass
// sampleItem.id = "hello";
// console.log('id expected to not be "hello" ', sampleItem, sampleItem.id);
sampleItem.tier = "project";
