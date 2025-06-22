"use strict";

import { User } from "./user.js";
import { UserPreferences } from "./userPreferences.js";

export class AppData {
  #games;
  #platforms;
  #user;
  #templates;
  #preferences;

  get user() {
    return this.#user;
  }

  get games() {
    return this.#games;
  }

  get platforms() {
    return this.#platforms;
  }

  get templates() {
    return this.#templates;
  }

  get preferences() {
    return this.#preferences;
  }

  constructor(userData, gamesData, platformsData, userPreferences) {
    this.#user = new User(userData);
    this.#games = Object.assign(
      {},
      ...gamesData.map((game) => {
        const gameObject = {};
        gameObject[game.id] = game;
        return gameObject;
      })
    );
    this.#platforms = Object.assign(
      {},
      ...platformsData.map((platform) => {
        const platformObject = {};
        platformObject[platform.id] = platform;
        return platformObject;
      })
    );
    this.#templates = {};
    this.#preferences = new UserPreferences(userPreferences);
  }
}
