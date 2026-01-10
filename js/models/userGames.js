"use strict";

export class UserGames {
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

  yearsWithFinishedOrAbandonedGames(kind) {
    if (kind !== "finished" && kind !== "abandoned") {
      throw new Error(
        `Invalid kind parameter: "${kind}". Must be "finished" or "abandoned".`
      );
    }

    const filterFn =
      kind === "finished" ? (game) => game.finished : (game) => game.abandoned;

    // newest first
    return Array.from(
      new Set(
        this.withFinishedYear()
          .filter(filterFn)
          .map((game) => game.year_finished)
      )
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

  abandonedByYear(year) {
    return this.items.filter(
      (game) => game.year_finished === year && game.abandoned
    );
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
