"use strict";

import {
  fillAbandonedColumn,
  fillAbandonedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillCatalogAutoExcludeCurrentValue,
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
  fillPaginationIndexes,
  filterGamesBy,
  paginate,
  sortGamesBy,
  sortPlatformsBy,
} from "./components.js";

export function fillUserPlatformsTemplate(filter, filterValue) {
  let sourceId = "user-platforms";

  const platforms = sortPlatformsBy(
    appData.user.platforms.items,
    filter,
    filterValue
  );

  const operations = [
    fillCapitalizedUserName,
    fillBackButton,
    (content) =>
      fillTableRows(
        content,
        platforms,
        sourceId,
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

  return renderMarkup(sourceId, operations);
}

export function fillUserGamesTemplate(
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "user-games";

  const autoExcludeAbandoned = appData.preferences.shouldAutoExclude();

  const pagination = paginate(
    sortGamesBy(
      filterGamesBy(
        appData.user.games.items,
        "abandoned",
        autoExcludeAbandoned
      ),
      filter,
      filterValue
    ),
    { pageNumber, useIndexes: true }
  );

  const operations = [
    fillCapitalizedUserName,
    fillBackButton,
    (content) => fillPaginationIndexes(content, pagination.indexes),
    (content) => fillAbandonedColumn(content, autoExcludeAbandoned),
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
        gameStatusAll: !autoExcludeAbandoned,
        gameStatusFinished: autoExcludeAbandoned,
        gameStatusCurrentlyPlaying: autoExcludeAbandoned,
      }),
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

  return renderMarkup(sourceId, operations);
}

export function fillUserGamesByPlatformTemplate(
  platformId,
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  platformId = parseInt(platformId);
  let sourceId = "user-games-by-platform";

  const autoExcludeAbandoned = appData.preferences.shouldAutoExclude();

  const pagination = paginate(
    sortGamesBy(
      filterGamesBy(
        appData.user.games.byPlatform(platformId),
        "abandoned",
        autoExcludeAbandoned
      ),
      filter,
      filterValue
    ),
    { pageNumber, useIndexes: true }
  );

  const operations = [
    fillCapitalizedUserName,
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "user-games-by-platform",
        platformId,
        from,
      }),
    (content) => fillAbandonedColumn(content, autoExcludeAbandoned, true),
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
        {
          gameName: true,
          gameStatusAll: !autoExcludeAbandoned,
          gameStatusFinished: autoExcludeAbandoned,
          gameStatusCurrentlyPlaying: autoExcludeAbandoned,
        },
        {
          fromPlatformId: platformId,
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

  return renderMarkup(sourceId, operations);
}

export function fillGameDetailsTemplate(gameId, from, fromId) {
  const sourceId = "game-details";

  const gamePlatforms = sortPlatformsBy(
    appData.games[gameId].platforms,
    "name"
  );

  const operations = [
    (content) =>
      fillTableRows(
        content,
        gamePlatforms,
        sourceId,
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

  return renderMarkup(sourceId, operations);
}

export function fillAbandonedGamesTemplate(
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "abandoned-games";

  const pagination = paginate(
    sortGamesBy(appData.user.games.abandoned(), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    fillCapitalizedUserName,
    fillAbandonedGamesCountLiteral,
    fillBackButton,
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
      }),
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

  return renderMarkup(sourceId, operations);
}

export function fillCurrentlyPlayingGamesTemplate(
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "currently-playing-games";

  const pagination = paginate(
    sortGamesBy(appData.user.games.currentlyPlaying(), filter, filterValue),
    { pageNumber }
  );

  const operations = [
    fillCapitalizedUserName,
    fillCurrentlyPlayingGamesCountLiteral,
    fillBackButton,
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
        gameStatusFinished: true,
      }),
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

  return renderMarkup(sourceId, operations);
}

export function fillPendingGamesTemplate(
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "pending-games";

  const pagination = paginate(
    sortGamesBy(appData.user.games.pending(), filter, filterValue),
    { pageNumber }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillPendingGamesCountLiteral,
    fillBackButton,
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
      }),
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

  return renderMarkup(sourceId, transformations);
}

export function fillFinishedGamesTemplate(
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "finished-games";

  const pagination = paginate(
    sortGamesBy(appData.user.games.finished(), filter, filterValue),
    { pageNumber }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillFinishedGamesCountLiteral,
    fillBackButton,
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
      }),
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

  return renderMarkup(sourceId, transformations);
}

export function fillWishlistedGamesTemplate(
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "wishlisted-games";

  const pagination = paginate(
    sortGamesBy(appData.user.wishlistedGames.items, filter, filterValue),
    { pageNumber }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillWishlistedGamesCountLiteral,
    fillBackButton,
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
      }),
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

  return renderMarkup(sourceId, transformations);
}

export function fillCatalogTemplate() {
  const sourceId = "catalog";

  const transformations = [
    fillCatalogGamesCount,
    fillCatalogPlatformsCount,
    fillCatalogGamesCompletedPercent,
    fillCapitalizedUserName,
    fillCurrentlyPlayingGamesCountLiteral,
    fillPendingGamesCountLiteral,
    fillFinishedGamesCountLiteral,
    fillAbandonedGamesCountLiteral,
    fillWishlistedGamesCountLiteral,
    fillCatalogGamesProgressBar,
    fillCatalogAutoExcludeCurrentValue,
  ];

  return renderMarkup(sourceId, transformations);
}

function renderMarkup(templateId, transformations) {
  return transformations.reduce(
    (content, fn) => fn(content),
    appData.templates[templateId]
  );
}
