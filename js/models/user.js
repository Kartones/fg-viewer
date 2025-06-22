"use strict";

import { UserGames } from "./userGames.js";
import { UserPlatforms } from "./userPlatforms.js";
import { WishlistedGames } from "./wishlistedGames.js";

export class User {
  #data;
  #games;
  #platforms;
  #wishlistedGames;

  get id() {
    return this.#data.id;
  }

  get username() {
    return this.#data.username;
  }

  get games() {
    return this.#games;
  }

  set games(gamesList) {
    this.#games = new UserGames(gamesList);
  }

  get platforms() {
    return this.#platforms;
  }

  set platforms(platformsList) {
    this.#platforms = new UserPlatforms(platformsList);
  }

  get wishlistedGames() {
    return this.#wishlistedGames;
  }

  set wishlistedGames(gamesList) {
    this.#wishlistedGames = new WishlistedGames(gamesList);
  }

  constructor(userData) {
    this.#data = userData;
    this.#games = new UserGames([]);
    this.#platforms = new UserPlatforms([]);
    this.#wishlistedGames = new WishlistedGames([]);
  }
}
