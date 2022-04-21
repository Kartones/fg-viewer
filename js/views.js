"use strict";

import {
  fillAbandonedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillCatalogGamesCompletedPercent,
  fillCatalogGamesCount,
  fillDataFields,
  fillGameDLCBlock,
  fillGameName,
  fillGamePublishDate,
  fillGameURLs,
  fillCurrentlyPlayingGamesCountLiteral,
  fillFinishedGamesCountLiteral,
  fillGamesByPlatformCompletedPercent,
  fillGamesByPlatformCountLiteral,
  fillGamesByPlatformProgressBar,
  fillPendingGamesCountLiteral,
  fillPlatformName,
  fillCatalogPlatformsCount,
  fillCatalogGamesProgressBar,
  fillTableRows,
  fillWishlistedGamesCountLiteral,
  fillPaginationBlock,
  paginate,
  sortGamesBy,
  sortPlatformsBy,
} from "./components.js";

export function fillUserPlatformsTemplate(filter = null, filterValue = null) {
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "user-platforms";

  const platforms = sortPlatformsBy(
    appData.user.platforms.items,
    filter,
    filterValue
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        platforms,
        sourceId,
        "{{js-user-platforms-table}}",
        {
          platformLongName: true,
        },
        {
          isPlatformsList: true,
        }
      ),
    (content) =>
      fillDataFields(
        content,
        {
          from: false,
          fromId: false,
          // only has the default `nameFilter`
        },
        { filter, filterValue }
      ),
  ];

  return renderMarkup("user-platforms", operations);
}

export function fillUserGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "user-games";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.items, filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-user-games-table}}",
        {
          gameName: true,
          platformShortName: true,
          gameStatusAll: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
          currentlyPlayingFilter: true,
          finishedFilter: true,
          abandonedFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup("user-games", operations);
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
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "user-games-by-platform";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.byPlatform(platformId), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillPlatformName(content, platformId),
    (content) => fillGamesByPlatformCountLiteral(content, platformId),
    (content) => fillAbandonedGamesCountLiteral(content, platformId),
    (content) => fillCurrentlyPlayingGamesCountLiteral(content, platformId),
    (content) => fillFinishedGamesCountLiteral(content, platformId),
    (content) => fillPendingGamesCountLiteral(content, platformId),
    (content) => fillGamesByPlatformProgressBar(content, platformId),
    (content) => fillBackButton(content, from, fromId),
    (content) => fillGamesByPlatformCompletedPercent(content, platformId),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-user-games-by-platform-table}}",
        {
          gameName: true,
          gameStatusAll: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue,
        platformId
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformId: true,
          platformFilter: true,
          currentlyPlayingFilter: true,
          finishedFilter: true,
          abandonedFilter: true,
        },
        { from, fromId, platformId, filter, filterValue }
      ),
  ];

  return renderMarkup("user-games-by-platform", operations);
}

export function fillGameDetailsTemplate(gameId, from, fromId = null) {
  const sourceId = "game-details";

  const operations = [
    (content) =>
      fillTableRows(
        content,
        appData.games[gameId].platforms,
        sourceId,
        "{{js-game-platforms-table}}",
        {
          platformLongName: true,
        },
        {
          isPlatformsList: true,
          gameId,
        }
      ),
    (content) => fillGameName(content, gameId),
    (content) => fillGameDLCBlock(content, gameId, sourceId),
    (content) => fillBackButton(content, from, fromId),
    (content) => fillGamePublishDate(content, gameId),
    (content) => fillGameURLs(content, gameId),
  ];

  return renderMarkup("game-details", operations);
}

export function fillAbandonedGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "abandoned-games";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.abandoned(), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillAbandonedGamesCountLiteral(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-abandoned-games-table}}",
        {
          gameName: true,
          platformShortName: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup("abandoned-games", operations);
}

export function fillCurrentlyPlayingGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  if (filter === null || filter === "") {
    filter = "name";
  }
  let sourceId = "currently-playing-games";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.currentlyPlaying(), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillCurrentlyPlayingGamesCountLiteral(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-currently-playing-games-table}}",
        {
          gameName: true,
          platformShortName: true,
          gameStatusFinished: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
          finishedFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup("currently-playing-games", operations);
}

export function fillPendingGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "pending-games";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.pending(), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillPendingGamesCountLiteral(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-pending-games-table}}",
        {
          gameName: true,
          platformShortName: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup("pending-games", operations);
}

export function fillFinishedGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "finished-games";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.games.finished(), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillFinishedGamesCountLiteral(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-finished-games-table}}",
        {
          gameName: true,
          platformShortName: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup("finished-games", operations);
}

export function fillWishlistedGamesTemplate(
  from,
  fromId = null,
  filter = null,
  filterValue = null,
  pageNumber = 0
) {
  if (filter === null || filter === "") {
    filter = "name";
  }

  let sourceId = "wishlisted-games";

  pageNumber = parseInt(pageNumber);
  const pagination = paginate(
    sortGamesBy(appData.user.wishlistedGames.items, filter, filterValue),
    { pageNumber }
  );

  const operations = [
    (content) => fillCapitalizedUserName(content),
    (content) => fillWishlistedGamesCountLiteral(content),
    (content) => fillBackButton(content),
    (content) =>
      fillTableRows(
        content,
        pagination.items,
        sourceId,
        "{{js-wishlisted-games-table}}",
        {
          gameName: true,
          platformShortName: true,
        }
      ),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup("wishlisted-games", operations);
}

export function fillCatalogTemplate() {
  const operations = [
    (content) => fillCatalogGamesCount(content),
    (content) => fillCatalogPlatformsCount(content),
    (content) => fillCatalogGamesCompletedPercent(content),
    (content) => fillCapitalizedUserName(content),
    (content) => fillCurrentlyPlayingGamesCountLiteral(content),
    (content) => fillPendingGamesCountLiteral(content),
    (content) => fillFinishedGamesCountLiteral(content),
    (content) => fillAbandonedGamesCountLiteral(content),
    (content) => fillWishlistedGamesCountLiteral(content),
    (content) => fillCatalogGamesProgressBar(content),
  ];

  return renderMarkup("catalog", operations);
}

function renderMarkup(templateId, operations) {
  return operations.reduce(
    (previousValue, currentFn) => currentFn(previousValue),
    appData.templates[templateId]
  );
}
