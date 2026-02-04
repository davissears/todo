export class Jot {
  #id = crypto.randomUUID();
  #tier = "";
  constructor(tier, title) {
    this.tier = tier;
    this.title = title;
    // const validTiers = ["PROJECT", "TODO", "CHECKLIST", "CHECKITEM"];
    // if (validTiers.includes(this.tier)) {
    //   return (this.tier = tier);
    // } else {
    //   throw new Error(`invalid jot tier value:${tier}`);
    // }
  }
  get id() {
    return this.#id;
  }

  get tier() {
    return this.#tier;
  }
  set tier(tier) {
    const validTiers = ["PROJECT", "TODO", "CHECKLIST", "CHECKITEM"];
    if (validTiers.includes(tier)) {
      this.#tier = tier;
    } else {
      throw new Error(`invalid jot tier value:${tier}`);
    }
  }
  // get priority() {
  //   return this.priority;
  // }
}
// NOTE: testing
// object should be extensible to all other like objects
const sampleItem = new Jot("TODO", "Walk dog");
console.log(`tier expected to be: "TODO"`, sampleItem, sampleItem.tier);
sampleItem.tier = "PROJECT";
console.log(`tier expected to be "PROJECT"`, sampleItem, sampleItem.tier);
// sampleItem.tier = "coconut"; //this should throw
// sampleItem.tier = "project"; // this should throw
console.log('tier expected to be "PROJECT" ', sampleItem, sampleItem.tier);
