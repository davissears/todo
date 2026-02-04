export class Jot {
  #id = crypto.randomUUID();
  #tier = "";
  #description;
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

  get description() {
    return this.#description;
  }
  set description(description) {
    return (this.#description = description);
  }
  set tier(tier) {
    const validTiers = ["PROJECT", "TODO", "CHECKLIST", "CHECKITEM"];
    if (validTiers.includes(tier)) {
      this.#tier = tier;
    } else {
      throw new Error(`invalid jot tier value:${tier}`);
    }
  }
}
// NOTE: testing
// object should be extensible to all other like objects
const sampleItem = new Jot("TODO", "Walk dog");
// !: test description
sampleItem.description = "walk, bring dog with";
console.log(
  'description expected to be: "walk, bring dog with" ',
  sampleItem,
  sampleItem.description,
);
sampleItem.description = "walk, bring dog and treats";
console.log(
  `description expected to be: "walk, bring dog and treats"`,
  sampleItem,
  sampleItem.description,
);
// !: test tier
// console.log(`tier expected to be: "TODO"`, sampleItem, sampleItem.tier);
// sampleItem.tier = "PROJECT";
// console.log(`tier expected to be "PROJECT"`, sampleItem, sampleItem.tier);
// sampleItem.tier = "coconut"; //this should throw
// sampleItem.tier = "project"; // this should throw
// console.log('tier expected to be "PROJECT" ', sampleItem, sampleItem.tier);
