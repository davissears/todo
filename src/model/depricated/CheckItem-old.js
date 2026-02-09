// BaseJotV2 {
//   // all common methods
// }

// class JotNote {
//   note = ''
// }
// class JotPriority {
//   priotity = 'HIGH'
// }
// TODO: class Checklist extends JotNote, JotPriority{

// }
// class CheckItem extends JotNote {

// }

// const a = new CheckItem()
// a.note
// const list = new Checklist()
// list.pr
// class PrioritizedJotV2 extends BaseJotV2 {
//   tier: .....
//   priority
// }

// class UnprioritizedJotV2 extends BaseJotV2 {
//    tier: checkItem
// }

export class JotV2 {
  #id = crypto.randomUUID();
  #tier = "checkItem";
  description = "";
  status = "active";
  constructor(tier, title) {
    this.title = title;
    // this.#id
  }

  // tier : 'PROJECT' | 'CHECKLIST' | 'CHECKITEM
  // description
  // status
  // note
  // dueDateTime
  //
  get priority() {
    if (this.tier === "CHECKITREM") {
      throw new Error();
    }
    return this.priority;
  }

  get id() {
    return this.#id;
  }
  get tier() {
    return this.#tier;
  }

  set status(string) {
    const isBlocked = string.startsWith("blocked:");
    const validStatuses = [
      "",
      "complete",
      "spotlight",
      "active",
      "inactive",
      "pending",
    ];

    if (validStatuses.includes(string) || isBlocked) {
      _status = string;
    } else {
      console.error(`invalid status: ${string}`);
    }
  }
}

const sampleItem = new CheckItem("Call mom");
console.log("My checklist item", sampleItem);
// sampleItem.id = "hello";
console.log(sampleItem, sampleItem.id);

const sampleItem1 = new CheckItem("Call mom");
console.log("My checklist item", sampleItem1);
// sampleItem1.id = "hello";
console.log(sampleItem1, sampleItem1.id);
