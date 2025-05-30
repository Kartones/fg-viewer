"use strict";

import {
  fillAbandonedColumn,
  fillAbandonedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillCatalogAutoExcludeCurrentValue,
  fillCatalogGamesCompletedPercent,
  fillCatalogGamesCount,
  fillCatalogGamesProgressBar,
  fillCatalogPlatformsCount,
  fillOptionalCatalogHeader,
  fillDataFields,
  fillGameDLCBlock,
  fillGameName,
  fillGamePublishDate,
  fillGameURLs,
  fillCurrentlyPlayingGamesCountLiteral,
  fillFinishedGamesByYearCountLiteral,
  fillFinishedGamesCountLiteral,
  fillGamesByPlatformCompletedPercent,
  fillGamesByPlatformCountLiteral,
  fillGamesByPlatformProgressBar,
  fillPaginationBlock,
  fillPendingGamesCountLiteral,
  fillYear,
  fillPlatformName,
  fillSearchComponent,
  fillTableRows,
  fillWishlistedGamesCountLiteral,
  fillRandomGame,
  fillPaginationIndexes,
  filterGamesBy,
  fillYearSelectorComponent,
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
    (content) => fillSearchComponent(content, sourceId),
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
    (content) => fillSearchComponent(content, sourceId, platformId),
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

  const userGames = filterGamesBy(
    appData.user.games.items,
    "game_id",
    gameId
  ).map((game) => ({
    platform_id: game.platform_id,
    finished: game.finished,
    currently_playing: game.currently_playing,
    abandoned: game.abandoned,
    wishlisted: false,
  }));

  const userWishlistedGames = filterGamesBy(
    appData.user.wishlistedGames.items,
    "game_id",
    gameId
  ).map((game) => ({
    platform_id: game.platform_id,
    finished: false,
    currently_playing: false,
    abandoned: false,
    wishlisted: true,
  }));

  const operations = [
    (content) =>
      fillTableRows(
        content,
        gamePlatforms,
        sourceId,
        {
          platformLongName: true,
          platformGameStatusAll: true,
        },
        {
          isPlatformsList: true,
          gameId,
          userGames: userGames.concat(userWishlistedGames),
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
    { pageNumber, useIndexes: true }
  );

  const operations = [
    fillCapitalizedUserName,
    fillAbandonedGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "abandoned-games",
        from,
      }),
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
    { pageNumber, useIndexes: true }
  );

  const operations = [
    fillCapitalizedUserName,
    fillCurrentlyPlayingGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "currently-playing-games",
        from,
      }),
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
    { pageNumber, useIndexes: true }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillPendingGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "pending-games",
        from,
      }),
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

export function fillFinishedGamesByYearTemplate(
  year,
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "finished-games-by-year";

  const autoExcludeAbandoned = appData.preferences.shouldAutoExclude();

  const pagination = paginate(
    sortGamesBy(
      appData.user.games.finishedByYear(year, autoExcludeAbandoned),
      filter,
      filterValue
    ),
    { pageNumber, useIndexes: true }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillBackButton,
    (content) => fillPaginationIndexes(content, pagination.indexes),
    (content) => fillFinishedGamesByYearCountLiteral(content, year),
    (content) => fillYear(content, year),
    (content) => fillYearSelectorComponent(content),
    (content) =>
      fillAbandonedColumn(content, autoExcludeAbandoned, false, sourceId),
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
        gameStatusFinished: true,
        gameStatusAbandoned: !autoExcludeAbandoned,
      }),
    (content) =>
      fillPaginationBlock(
        content,
        pagination,
        sourceId,
        from,
        fromId,
        filter,
        filterValue,
        year
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
          finishedFilter: true,
          abandonedFilter: true,
        },
        { from, fromId, filter, filterValue, year }
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
    { pageNumber, useIndexes: true }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillFinishedGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "finished-games",
        from,
      }),
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
    { pageNumber, useIndexes: true }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillWishlistedGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "wishlisted-games",
        from,
      }),
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
    fillOptionalCatalogHeader,
  ];

  return renderMarkup(sourceId, transformations);
}

export function fillRandomGameTemplate() {
  const sourceId = "random-game";

  const transformations = [fillBackButton, fillRandomGame];

  return renderMarkup(sourceId, transformations);
}

function renderMarkup(templateId, transformations) {
  return transformations.reduce(
    (content, fn) => fn(content),
    appData.templates[templateId]
  );
}
