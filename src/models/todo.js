export class Jot {
  #id = crypto.randomUUID();
  #tier = "";
  #description;
  #status;
  constructor(tier, title) {
    this.tier = tier;
    this.title = title;
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
      return (this.#tier = tier);
    } else {
      throw new Error(`invalid jot tier value:${tier}`);
    }
  }

  get description() {
    return this.#description;
  }
  set description(description) {
    return (this.#description = description);
  }

  get status() {
    return this.#status;
  }
  set status(status) {
    const validStatus = ["COMPLETE", "ACTIVE", "BLOCKED"];
    if (validStatus.includes(status)) {
      return (this.#status = status);
    } else {
      throw new Error(`invalid jot status value: ${status}`);
    }
  }
}
// NOTE: testing
// TODO: delete testing before merging
// object should be extensible to all other like objects
const sampleItem = new Jot("TODO", "Walk dog");
//
// !: status tests
console.log(sampleItem.status); // should return 'undefined'
sampleItem.status = "ACTIVE";
console.log("status expected to be: ACTIVE", sampleItem, sampleItem.status);
// sampleItem.status = "ACTIV"; //should cause throw
// console.log("status expected to be: ACTIVE", sampleItem, sampleItem.status);
// sampleItem.status = "active"; //should cause throw
// sampleItem.status = "COMP LETE"; //should cause throw

sampleItem.status = "COMPLETE";
console.log("status expected to be: 'COMPLETE'", sampleItem, sampleItem.status);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// !: test tier
// console.log(`tier expected to be: "TODO"`, sampleItem, sampleItem.tier);
// sampleItem.tier = "PROJECT";
// console.log(`tier expected to be "PROJECT"`, sampleItem, sampleItem.tier);
// // sampleItem.tier = "coconut"; //this should throw
// // sampleItem.tier = "project"; // this should throw
// console.log('tier expected to be "PROJECT" ', sampleItem, sampleItem.tier);
// !: test description
// sampleItem.description = "walk, bring dog with";
// console.log(
//   'description expected to be: "walk, bring dog with" ',
//   sampleItem,
//   sampleItem.description,
// );
// sampleItem.description = "walk, bring dog and treats";
// console.log(
//   `description expected to be: "walk, bring dog and treats"`,
//   sampleItem,
//   sampleItem.description,
// );
