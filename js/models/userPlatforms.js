"use strict";

export class UserPlatforms {
  #items;

  get items() {
    return this.#items;
  }

  get count() {
    return this.items.length;
  }

  constructor(platformsList) {
    this.#items = platformsList;
  }
}
