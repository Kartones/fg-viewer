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
  getPaginationBlock,
  nextStateOf,
  paginate,
  pluralize,
  sortGamesBy,
  sortPlatformsBy,
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

export function fillUserGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  let content = appData.templates["user-games"];

  let sourceId = "user-games";

  content = fillCapitalizedUserName(content);
  content = fillBackButton(content);

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.items, filter, filterValue),
    { pageNumber }
  );

  const userGames = pagination.items;

  const gamesFragment = userGames
    .map(
      (userGame) => `
      <tr ${
        userGame.finished
          ? 'class="row-finished"'
          : userGame.abandoned
          ? 'class="row-abandoned"'
          : ""
      }>
        <td>
          ${linkToGameDetails(userGame.game_id, sourceId)}
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

  return content
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-platform-filter-value}}",
      nextStateOf("platform", filter, filterValue)
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
    .replace("{{js-user-games-table}}", gamesFragment)
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      )
    );
}

export function fillUserGamesByPlatformTemplate(
  platformId,
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  platformId = parseInt(platformId);
  let content = appData.templates["user-games-by-platform"];

  let sourceId = "user-games-by-platform";

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.byPlatform(platformId), filter, filterValue),
    { pageNumber }
  );

  const userGamesByPlatform = pagination.items;

  const gamesByPlatformFragment = userGamesByPlatform
    .map(
      (userGame) => `
      <tr ${
        userGame.finished
          ? 'class="row-finished"'
          : userGame.abandoned
          ? 'class="row-abandoned"'
          : ""
      }>
          <td>
            ${linkToGameDetails(userGame.game_id, sourceId, platformId)}
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
    )
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue,
        platformId
      )
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

export function fillAbandonedGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  let content = appData.templates["abandoned-games"];

  let sourceId = "abandoned-games";

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.abandoned(), filter, filterValue),
    { pageNumber }
  );

  const userGames = pagination.items;

  const gamesFragment = userGames
    .map(
      (userGame) => `
      <tr class="row-abandoned">
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

  return content
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-platform-filter-value}}",
      nextStateOf("platform", filter, filterValue)
    )
    .replace("{{js-abandoned-games-table}}", gamesFragment)
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      )
    );
}

export function fillCurrentlyPlayingGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  let content = appData.templates["currently-playing-games"];

  let sourceId = "currently-playing-games";

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.currentlyPlaying(), filter, filterValue),
    { pageNumber }
  );

  const userGames = pagination.items;

  const gamesFragment = userGames
    .map(
      (userGame) => `
      <tr ${userGame.finished ? 'class="row-finished"' : ""}>
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
      "{{js-platform-filter-value}}",
      nextStateOf("platform", filter, filterValue)
    )
    .replaceAll(
      "{{js-finished-filter-value}}",
      nextStateOf("finished", filter, filterValue)
    )
    .replace("{{js-currently-playing-games-table}}", gamesFragment)
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      )
    );
}

export function fillPendingGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  let content = appData.templates["pending-games"];

  let sourceId = "pending-games";

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.pending(), filter, filterValue),
    { pageNumber }
  );

  const userGames = pagination.items;

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
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillPendingGamesCountLiteral(content);
  content = fillBackButton(content);

  return content
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-platform-filter-value}}",
      nextStateOf("platform", filter, filterValue)
    )
    .replace("{{js-pending-games-table}}", gamesFragment)
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      )
    );
}

export function fillFinishedGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  let content = appData.templates["finished-games"];

  let sourceId = "finished-games";

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);

  const pagination = paginate(
    sortGamesBy(appData.user.games.finished(), filter, filterValue),
    { pageNumber }
  );

  const userGames = pagination.items;

  const gamesFragment = userGames
    .map(
      (userGame) => `
      <tr class="row-finished">
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
  content = fillFinishedGamesCountLiteral(content);
  content = fillBackButton(content);

  return content
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-platform-filter-value}}",
      nextStateOf("platform", filter, filterValue)
    )
    .replace("{{js-finished-games-table}}", gamesFragment)
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      )
    );
}

export function fillWishlistedGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  let content = appData.templates["wishlisted-games"];

  let sourceId = "wishlisted-games";

  if (filter === null || filter === "") {
    filter = "name";
  }

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.wishlistedGames.items, filter, filterValue),
    { pageNumber }
  );

  const userGames = pagination.items;

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
      </tr>`
    )
    .join("");

  content = fillCapitalizedUserName(content);
  content = fillWishlistedGamesCountLiteral(content);
  content = fillBackButton(content);

  return content
    .replaceAll("{{js-from}}", from)
    .replaceAll("{{js-from-id}}", fromId)
    .replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", filter, filterValue)
    )
    .replaceAll(
      "{{js-platform-filter-value}}",
      nextStateOf("platform", filter, filterValue)
    )
    .replace("{{js-wishlisted-games-table}}", gamesFragment)
    .replace(
      "{{js-pagination}}",
      getPaginationBlock(
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      )
    );
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
