"use strict";

import {
  fillPlatformName,
  fillGameName,
  fillGamePublishDate,
  fillGameDLCBlock,
  fillGameURLs,
  fillAbandonedGamesCountLiteral,
  fillCurrentlyPlayingGamesCountLiteral,
  fillFinishedGamesCountLiteral,
  fillGamesByPlatformCountLiteral,
  fillPendingGamesCountLiteral,
  fillWishlistedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillProgressBar,
  getGameStatusRow,
  nextStateOf,
  sortGamesBy,
  sortPlatformsBy,
  pluralize,
  linkToGameDetails,
  linkToUserGamesByPlatform,
} from "./components.js";

export function fillUserPlatformsTemplate(filter = null, filterValue = null) {
  let content = appData.templates["user-platforms"];

  if (filter === null || filter === "") {
    filter = "name";
  }

  const platforms = sortPlatformsBy(
    appData.user.platforms.items,
    filter,
    filterValue
  );

  const platformsFragment = platforms
    .map(
      (platformId) => `
      <tr>
        <td>
          ${linkToUserGamesByPlatform(platformId, true, "user-platforms")}
        </td>
      </tr>
      `
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillBackButton(content);

  return content
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replace("{{js-user-platforms-table}}", platformsFragment);
}

export function fillUserGamesTemplate() {
  let content = appData.templates["user-games"];

  content = fillCapitalizedUserName(content);
  content = fillBackButton(content);

  const gamesFragment = appData.user.games.items
    .map(
      (userGame) => `
      <tr>
        <td>
          ${linkToGameDetails(userGame.game_id, "user-games")}
        </td>
        <td class="is-centered">
          ${linkToUserGamesByPlatform(
            userGame.platform_id,
            false,
            "user-games"
          )}
        </td>
        <td class="is-centered">
          ${getGameStatusRow(userGame)}
        </td>
      </tr>
      `
    )
    .join("");

  return content.replace("{{js-user-games-table}}", gamesFragment);
}

export function fillUserGamesByPlatformTemplate(
  platformId,
  from,
  fromId = null,
  filter = null,
  filterValue = null
) {
  platformId = parseInt(platformId);
  let content = appData.templates["user-games-by-platform"];

  if (filter === null || filter === "") {
    filter = "name";
  }

  const userGamesByPlatform = sortGamesBy(
    appData.user.games.byPlatform(platformId),
    filter,
    filterValue
  );

  const gamesByPlatformFragment = userGamesByPlatform
    .map(
      (userGame) => `
      <tr>
          <td>
            ${linkToGameDetails(
              userGame.game_id,
              "user-games-by-platform",
              platformId
            )}
          </td>
          <td class="is-centered">
            ${getGameStatusRow(userGame)}
          </td>
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillPlatformName(content, platformId);
  content = fillGamesByPlatformCountLiteral(content, platformId);
  content = fillAbandonedGamesCountLiteral(content, platformId);
  content = fillCurrentlyPlayingGamesCountLiteral(content, platformId);
  content = fillFinishedGamesCountLiteral(content, platformId);
  content = fillPendingGamesCountLiteral(content, platformId);
  content = fillProgressBar(
    content,
    appData.user.games.completedPlatformCatalogPercent(platformId),
    appData.user.games.pendingByPlatform(platformId).length,
    appData.user.games.byPlatform(platformId).length
  );
  content = fillBackButton(content, from, fromId);

  return content
    .replaceAll("{{js-id}}", platformId)
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-currently-playing-filter-value}}",
      nextStateOf("currentlyPlaying", filter, filterValue)
    )
    .replaceAll(
      "{{js-finished-filter-value}}",
      nextStateOf("finished", filter, filterValue)
    )
    .replaceAll(
      "{{js-abandoned-filter-value}}",
      nextStateOf("abandoned", filter, filterValue)
    )
    .replace("{{js-user-games-by-platform-table}}", gamesByPlatformFragment)
    .replaceAll(
      "{{js-games-completed-percent}}",
      `${appData.user.games.completedPlatformCatalogPercent(platformId)}%`
    );
}

export function fillGameDetailsTemplate(gameId, from, fromId = null) {
  let content = appData.templates["game-details"];
  const game = appData.games[gameId];

  const platformsFragment = game.platforms
    .map(
      (platformId) => `
      <tr>
          <td>
            ${linkToUserGamesByPlatform(
              platformId,
              true,
              "game-details",
              gameId
            )}
          </td>
      </tr>`
    )
    .join("");

  content = fillGameName(content, gameId);
  content = fillGameDLCBlock(content, gameId, "game-details");
  content = fillBackButton(content, from, fromId);
  content = fillGamePublishDate(content, gameId);
  content = fillGameURLs(content, gameId);

  return content.replace("{{js-game-platforms-table}}", platformsFragment);
}

export function fillAbandonedGamesTemplate() {
  let content = appData.templates["abandoned-games"];

  let sourceId = "abandoned-games";

  const gamesFragment = appData.user.games
    .abandoned()
    .map(
      (userGame) => `
      <tr>
          <td>
            ${linkToGameDetails(userGame.game_id, sourceId)}
          </td>
          <td class="is-centered">
            ${linkToUserGamesByPlatform(userGame.platform_id, false, sourceId)}
          </td>
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillAbandonedGamesCountLiteral(content);
  content = fillBackButton(content);

  return content.replace("{{js-abandoned-games-table}}", gamesFragment);
}

export function fillCurrentlyPlayingGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null
) {
  let content = appData.templates["currently-playing-games"];

  let sourceId = "currently-playing-games";

  if (filter === null || filter === "") {
    filter = "name";
  }

  const userGames = sortGamesBy(
    appData.user.games.currentlyPlaying(),
    filter,
    filterValue
  );

  const gamesFragment = userGames
    .map(
      (userGame) => `
      <tr>
          <td>
            ${linkToGameDetails(userGame.game_id, sourceId)}
          </td>
          <td class="is-centered">
            ${linkToUserGamesByPlatform(userGame.platform_id, false, sourceId)}
          </td>
          <td class="is-centered">
            ${getGameStatusRow(userGame, {
              currentlyPlaying: false,
              finished: true,
              abandoned: false,
            })}
        </td>
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillCurrentlyPlayingGamesCountLiteral(content);
  content = fillBackButton(content);

  return content
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-finished-filter-value}}",
      nextStateOf("finished", filter, filterValue)
    )
    .replace("{{js-currently-playing-games-table}}", gamesFragment);
}

export function fillPendingGamesTemplate() {
  let content = appData.templates["pending-games"];

  let sourceId = "pending-games";

  const gamesFragment = appData.user.games
    .pending()
    .map(
      (userGame) => `
      <tr>
          <td>
            ${linkToGameDetails(userGame.game_id, sourceId)}
          </td>
          <td class="is-centered">
            ${linkToUserGamesByPlatform(userGame.platform_id, false, sourceId)}
          </td>
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillPendingGamesCountLiteral(content);
  content = fillBackButton(content);

  return content.replace("{{js-pending-games-table}}", gamesFragment);
}

export function fillFinishedGamesTemplate() {
  let content = appData.templates["finished-games"];

  let sourceId = "finished-games";

  const gamesFragment = appData.user.games
    .finished()
    .map(
      (userGame) => `
      <tr>
          <td>
            ${linkToGameDetails(userGame.game_id, sourceId)}
          </td>
          <td class="is-centered">
            ${linkToUserGamesByPlatform(userGame.platform_id, false, sourceId)}
          </td>
          <td class="is-centered">
            ${userGame.year_finished}
          </td>
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillFinishedGamesCountLiteral(content);
  content = fillBackButton(content);

  return content.replace("{{js-finished-games-table}}", gamesFragment);
}

export function fillWishlistedGamesTemplate() {
  let content = appData.templates["wishlisted-games"];

  let sourceId = "wishlisted-games";

  const gamesFragment = appData.user.wishlistedGames.items
    .map(
      (userGame) => `
      <tr>
          <td>
            ${linkToGameDetails(userGame.game_id, sourceId)}
          </td>
          <td class="is-centered">
            ${linkToUserGamesByPlatform(userGame.platform_id, false, sourceId)}
          </td>
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillWishlistedGamesCountLiteral(content);
  content = fillBackButton(content);

  return content.replace("{{js-wishlisted-games-table}}", gamesFragment);
}

export function fillCatalogTemplate() {
  let content = appData.templates["catalog"]
    .replaceAll(
      "{{js-games-count}}",
      `<strong>${appData.user.games.count}</strong> ${pluralize(
        "game",
        appData.user.games
      )}`
    )
    .replaceAll(
      "{{js-platforms-count}}",
      `<strong>${appData.user.platforms.count}</strong> ${pluralize(
        "platform",
        appData.user.platforms
      )}`
    )
    .replaceAll(
      "{{js-games-completed-percent}}",
      `${appData.user.games.completedCatalogPercent()}%`
    );

  content = fillCapitalizedUserName(content);
  content = fillCurrentlyPlayingGamesCountLiteral(content);
  content = fillPendingGamesCountLiteral(content);
  content = fillFinishedGamesCountLiteral(content);
  content = fillAbandonedGamesCountLiteral(content);
  content = fillWishlistedGamesCountLiteral(content);
  content = fillProgressBar(
    content,
    appData.user.games.completedCatalogPercent(),
    appData.user.games.pending().length,
    appData.user.games.count
  );

  return content;
}
