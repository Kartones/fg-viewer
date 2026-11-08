"use strict";

export class UserPreferences {
  #show_catalog_header;
  #show_game_time;

  get showCatalogHeader() {
    return this.#show_catalog_header;
  }

  get showGameTime() {
    return this.#show_game_time;
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
    this.#show_game_time = userPreferences.show_game_time ?? true;
  }
}
