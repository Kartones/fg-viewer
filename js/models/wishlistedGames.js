"use strict";

export class WishlistedGames {
  #items;

  get items() {
    return this.#items;
  }

  get count() {
    return this.items.length;
  }

  constructor(gamesList) {
    this.#items = gamesList;
  }
}
