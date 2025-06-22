"use strict";

import { AppData } from "../models.js";
import { sortGamesBy, sortPlatformsBy } from "../components.js";

export class DataLoader {
  static async readData() {
    const timestampMark = Date.now();

    await Promise.all([
      fetch(`data/user.json?v=${timestampMark}`),
      fetch(`data/games.json?v=${timestampMark}`),
      fetch(`data/platforms.json?v=${timestampMark}`),
      fetch(`data/prefs.json?v=${timestampMark}`),
    ])
      .then(async ([userData, gamesData, platformsData, userPrefs]) => {
        const user = await userData.json();
        const games = await gamesData.json();
        const platforms = await platformsData.json();
        const userPreferences = await userPrefs.json();
        window.appData = new AppData(user, games, platforms, userPreferences);
      })
      .then(() =>
        Promise.all([
          fetch(
            `data/user_${window.appData.user.id}_games.json?v=${timestampMark}`
          ),
          fetch(
            `data/user_${window.appData.user.id}_wishlisted_games.json?v=${timestampMark}`
          ),
        ])
      )
      .then(async ([userGamesData, userWishlistedGamesData]) => {
        const userGames = sortGamesBy(await userGamesData.json(), "name");
        window.appData.user.games = userGames;

        let userPlatforms = Array.from(
          new Set(userGames.map((game) => game.platform_id))
        );
        userPlatforms = sortPlatformsBy(userPlatforms, "name");
        window.appData.user.platforms = userPlatforms;

        const wishlistedGames = await userWishlistedGamesData.json();
        wishlistedGames.sort((wishlistedGame1, wishlistedGame2) =>
          window.appData.games[wishlistedGame1.game_id].name.localeCompare(
            window.appData.games[wishlistedGame2.game_id].name
          )
        );

        window.appData.user.wishlistedGames = wishlistedGames;
      })
      .then(() => DataLoader.loadTemplates())
      .then(() => up.emit("link:catalog", { transition: "cross-fade" }))
      .catch((error) => {
        up.emit("feedback:error");
        console.error(error);
      });
  }

  static async loadTemplates() {
    const templateFiles = [
      "catalog.html",
      "game_details.html",
      "abandoned_games.html",
      "currently_playing_games.html",
      "pending_games.html",
      "finished_games.html",
      "finished_games_by_year.html",
      "wishlisted_games.html",
      "user_games.html",
      "user_games_by_platform.html",
      "user_platforms.html",
      "random_game.html",
    ];

    const responses = await Promise.all(
      templateFiles.map((file) => fetch(`templates/${file}`))
    );

    await Promise.all(
      responses.map(async (response) => {
        const templateName = response.url
          .slice(response.url.lastIndexOf("/") + 1)
          .split(".")[0]
          .replaceAll("_", "-");
        window.appData.templates[templateName] = await response.text();
      })
    );
  }
}
