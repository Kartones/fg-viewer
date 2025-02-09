"use strict";

class UserGames {
  #items;

  get items() {
    return this.#items;
  }

  get count() {
    return this.items.length;
  }

  currentlyPlaying() {
    return this.items.filter((game) => game.currently_playing);
  }

  currentlyPlayingByPlatform(platformId) {
    return this.byPlatform(platformId).filter((game) => game.currently_playing);
  }

  finished() {
    return this.items.filter((game) => game.finished);
  }

  finishedByPlatform(platformId) {
    return this.byPlatform(platformId).filter((game) => game.finished);
  }

  withFinishedYear() {
    return this.items.filter((game) => game.year_finished !== null);
  }

  finishedByYear(year, excludeAbandoned = false) {
    return this.items
      .filter((game) => game.year_finished === year)
      .filter((game) =>
        excludeAbandoned ? game.finished : game.finished || game.abandoned
      );
  }

  yearsWithFinishedOrAbandonedGames() {
    // newest first
    return Array.from(
      new Set(this.withFinishedYear().map((game) => game.year_finished))
    ).sort((a, b) => b - a);
  }

  pending() {
    return this.items.filter((game) => !(game.finished || game.abandoned));
  }

  pendingByPlatform(platformId) {
    return this.byPlatform(platformId).filter(
      (game) => !(game.finished || game.abandoned)
    );
  }

  abandoned() {
    return this.items.filter((game) => game.abandoned);
  }

  abandonedByPlatform(platformId) {
    return this.byPlatform(platformId).filter((game) => game.abandoned);
  }

  byGame(gameId) {
    return this.items.filter((game) => game.game_id === gameId);
  }

  byPlatform(platformId) {
    return this.items.filter((game) => game.platform_id === platformId);
  }

  completedPlatformCatalogPercent(platformId) {
    const platformGamesCount = this.byPlatform(platformId).length;
    if (platformGamesCount === 0) {
      return 0;
    }

    return Math.floor(
      ((platformGamesCount - this.pendingByPlatform(platformId).length) /
        platformGamesCount) *
        100
    );
  }

  completedCatalogPercent() {
    return Math.floor(
      ((this.items.length - this.pending().length) / this.items.length) * 100
    );
  }

  constructor(gamesList) {
    this.#items = gamesList;
  }
}

class UserPlatforms {
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

class WishlistedGames {
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

class User {
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

class UserPreferences {
  #show_catalog_header;

  get showCatalogHeader() {
    return this.#show_catalog_header;
  }

  shouldAutoExclude() {
    return (
      decodeURIComponent(document.cookie)
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("auto_exclude")) !== undefined
    );
  }

  toggleAutoExclude() {
    // 1 year when setting
    const expiration = this.shouldAutoExclude() ? -1 : 31536000;
    document.cookie = `auto_exclude=abandoned;max-age=${expiration};path=/; SameSite=None; Secure`;
  }

  constructor(userPreferences) {
    this.#show_catalog_header = userPreferences.show_catalog_header;
  }
}

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
