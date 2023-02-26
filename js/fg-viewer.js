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
  fillRandomGameTemplate,
} from "./views.js";
import { sortGamesBy, sortPlatformsBy } from "./components.js";
import { DEFAULT_FILTER, DEFAULT_SOURCE_ID } from "./enums.js";

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
        // Sorting now avoids quite a few additional sorts later (we'll only .filter() )

        const userGames = sortGamesBy(await userGamesData.json(), "name");
        appData.user.games = userGames;

        let userPlatforms = Array.from(
          new Set(userGames.map((game) => game.platform_id))
        );
        userPlatforms = sortPlatformsBy(userPlatforms, "name");
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
          fetch("templates/random_game.html"),
        ]).then((responses) => {
          return Promise.all(
            responses.map(async (response) => {
              const templateName = response.url
                .slice(response.url.lastIndexOf("/") + 1)
                .split(".")[0]
                .replaceAll("_", "-");
              appData.templates[templateName] = await response.text();
            })
          );
        })
      )
      .then(() => up.emit("link:catalog", { transition: "cross-fade" }))
      .catch((error) => {
        up.emit("feedback:error");
        console.error(error);
      });
  }

  // Routing

  up.compiler("#content", () => readData());

  up.on("link:catalog", (event, _element) => {
    event.transition ||= "move-right";

    up.render("section.main-container", {
      fragment: fillCatalogTemplate(),
      transition: event.transition,
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:abandoned-games", (event, element) => {
    up.render("section.main-container", {
      fragment: fillAbandonedGamesTemplate(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:currently-playing-games", (event, element) => {
    up.render("section.main-container", {
      fragment: fillCurrentlyPlayingGamesTemplate(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:pending-games", (event, element) => {
    up.render("section.main-container", {
      fragment: fillPendingGamesTemplate(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:finished-games", (event, element) => {
    up.render("section.main-container", {
      fragment: fillFinishedGamesTemplate(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:wishlisted-games", (event, element) => {
    up.render("section.main-container", {
      fragment: fillWishlistedGamesTemplate(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:game-details", (event, element) => {
    // special case, when emitted from the game search data comes at event, instead of from element
    up.render("section.main-container", {
      fragment: fillGameDetailsTemplate(
        parseInt(element.dataset?.id) || parseInt(event.gameId),
        element.dataset?.from || event.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset?.fromId) || ""
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });

    event.preventDefault();
  });

  up.on("link:user-games", (event, element) => {
    up.render("section.main-container", {
      fragment: fillUserGamesTemplate(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });

    event.preventDefault();
  });

  up.on("link:user-games-by-platform", (event, element) => {
    up.render("section.main-container", {
      fragment: fillUserGamesByPlatformTemplate(
        parseInt(element.dataset.id),
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });

    event.preventDefault();
  });

  up.on("link:user-platforms", (event, element) => {
    up.render("section.main-container", {
      fragment: fillUserPlatformsTemplate(
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || ""
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  });

  up.on("link:random-game", (event) => {
    up.render("section.main-container", {
      fragment: fillRandomGameTemplate(),
      transition: event.transition,
      scroll: "main",
    });
    event.preventDefault();
  });

  // other events

  up.on("up:click", function (event) {
    // special cases to do cleaning (select items)
    //  div class="select"
    //  span class="current"
    //  div class="nice-select"
    //  li class="option"
    if (!["DIV", "LI", "SPAN"].includes(event.target.tagName)) {
      cleanSearchBox();
    } else {
      if (
        !["select", "nice-select", "option", "current"].some((cls) =>
          event.target.classList.contains(cls)
        )
      ) {
        cleanSearchBox();
      }
    }
  });

  up.on("up:fragment:inserted", function (_event, fragment) {
    if (fragment.innerHTML.includes('select id="gameSearch"')) {
      const searchSelectelement = document.getElementById("gameSearch");

      const searchBox = NiceSelect.bind(searchSelectelement, {
        searchable: true,
        placeholder: "Type to search",
        searchtext: "Type to search",
      });
      searchBox.update();

      searchSelectelement.addEventListener("change", (event) => {
        const value = parseInt(event.target.value, 10);
        if (value !== -1) {
          cleanSearchBox();
          up.emit("link:game-details", { gameId: value, from: "user-games" });
        }
      });
    }
  });

  up.on("up:fragment:destroyed", function (_event, fragment) {
    if (fragment.innerHTML.includes('select id="gameSearch"')) {
      cleanSearchBox();
    }
  });

  up.on("feedback:error", () => {
    up.render("#feedback", {
      fragment: `<div id="feedback" class="nes-balloon from-right">
            <span class="feedback-error">
                There was an error loading the data. <br/>Please reload the page or try again later.
            </span>
        </div>`,
    });
  });

  // helpers

  const cleanSearchBox = () => {
    const searchSelectelement = document.getElementById("gameSearch");
    if (searchSelectelement) {
      const searchBox = NiceSelect.bind(searchSelectelement);
      searchBox.destroy();
    }
  };
})();
