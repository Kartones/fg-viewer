"use strict";

import { AppData } from "./models.js";
import {
  fillGameDetailsTemplate,
  fillAbandonedGamesTemplate,
  fillCurrentlyPlayingGamesTemplate,
  fillPendingGamesTemplate,
  fillFinishedGamesTemplate,
  fillWishlistedGamesTemplate,
  fillCatalogTemplate,
  fillUserGamesTemplate,
  fillUserGamesByPlatformTemplate,
  fillUserPlatformsTemplate,
} from "./views.js";

window.appData = null;

(function () {
  async function readData() {
    const timestampMark = Date.now();

    await Promise.all([
      fetch(`data/user.json?v=${timestampMark}`),
      fetch(`data/games.json?v=${timestampMark}`),
      fetch(`data/platforms.json?v=${timestampMark}`),
    ])
      .then(async ([userData, gamesData, platformsData]) => {
        const user = await userData.json();
        const games = await gamesData.json();
        const platforms = await platformsData.json();
        appData = new AppData(user, games, platforms);
      })
      .then(() =>
        Promise.all([
          fetch(`data/user_${appData.user.id}_games.json?v=${timestampMark}`),
          fetch(
            `data/user_${appData.user.id}_wishlisted_games.json?v=${timestampMark}`
          ),
        ])
      )
      .then(async ([userGamesData, userWishlistedGamesData]) => {
        // Sorting now avoids multiple sorts later (we'll only .filter() )

        const userGames = await userGamesData.json();
        userGames.sort((game1, game2) =>
          appData.games[game1.game_id].name.localeCompare(
            appData.games[game2.game_id].name
          )
        );
        appData.user.games = userGames;

        const userPlatforms = Array.from(
          new Set(userGames.map((game) => game.platform_id))
        );
        userPlatforms.sort((platformId1, platformId2) =>
          appData.platforms[platformId1].name.localeCompare(
            appData.platforms[platformId2].name
          )
        );
        appData.user.platforms = userPlatforms;

        const wishlistedGames = await userWishlistedGamesData.json();
        wishlistedGames.sort((wishlistedGame1, wishlistedGame2) =>
          appData.games[wishlistedGame1.game_id].name.localeCompare(
            appData.games[wishlistedGame2.game_id].name
          )
        );

        appData.user.wishlistedGames = wishlistedGames;
      })
      .then(() =>
        Promise.all([
          fetch("templates/catalog.html"),
          fetch("templates/game_details.html"),
          fetch("templates/abandoned_games.html"),
          fetch("templates/currently_playing_games.html"),
          fetch("templates/pending_games.html"),
          fetch("templates/finished_games.html"),
          fetch("templates/wishlisted_games.html"),
          fetch("templates/user_games.html"),
          fetch("templates/user_games_by_platform.html"),
          fetch("templates/user_platforms.html"),
        ])
      )
      .then(
        async ([
          catalogHTML,
          gameDetailsHTML,
          abandonedGamesHTML,
          currentlyPlayingGamesHTML,
          pendingGamesHTML,
          finishedGamesHTML,
          wishlistedGamesHTML,
          userGamesHTML,
          userGamesByPlatformHTML,
          userPlatformsHTML,
        ]) => {
          appData.templates["catalog"] = await catalogHTML.text();
          appData.templates["abandoned-games"] =
            await abandonedGamesHTML.text();
          appData.templates["currently-playing-games"] =
            await currentlyPlayingGamesHTML.text();
          appData.templates["pending-games"] = await pendingGamesHTML.text();
          appData.templates["finished-games"] = await finishedGamesHTML.text();
          appData.templates["wishlisted-games"] =
            await wishlistedGamesHTML.text();
          appData.templates["game-details"] = await gameDetailsHTML.text();
          appData.templates["user-games"] = await userGamesHTML.text();
          appData.templates["user-games-by-platform"] =
            await userGamesByPlatformHTML.text();
          appData.templates["user-platforms"] = await userPlatformsHTML.text();
        }
      )
      .then(() => up.emit("link:catalog", { transition: "cross-fade" }))
      .catch((error) => {
        up.emit("feedback:error");
        console.error(error);
      });
  }

  // Routing

  up.compiler("#content", () => readData());

  up.on("feedback:error", () => {
    up.render("#feedback", {
      fragment: `<div id="feedback" class="nes-balloon from-right">
            <span class="feedback-error">
                There was an error loading the data. <br/>Please reload the page or try again later.
            </span>
        </div>`,
    });
  });

  up.on("link:catalog", (event, _element) => {
    event.transition ||= "move-right";

    up.render("section.main-container", {
      fragment: fillCatalogTemplate(),
      transition: event.transition,
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:abandoned-games", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillAbandonedGamesTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:currently-playing-games", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillCurrentlyPlayingGamesTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:pending-games", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillPendingGamesTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:finished-games", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillFinishedGamesTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:wishlisted-games", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillWishlistedGamesTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:game-details", (event, element) => {
    up.render("section.main-container", {
      fragment: fillGameDetailsTemplate(
        element.dataset.id,
        element.dataset.from || "catalog",
        element.dataset.fromId || null
      ),
      transition: "move-left",
      scroll: "main",
    });

    event.preventDefault();
  });

  up.on("link:user-games", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillUserGamesTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:user-games-by-platform", (event, element) => {
    up.render("section.main-container", {
      fragment: fillUserGamesByPlatformTemplate(
        element.dataset.id,
        element.dataset.from || "catalog",
        element.dataset.fromId || null
      ),
      transition: "move-left",
      scroll: "main",
    });

    event.preventDefault();
  });

  up.on("link:user-platforms", (event, _element) => {
    up.render("section.main-container", {
      fragment: fillUserPlatformsTemplate(),
      transition: "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });
})();
