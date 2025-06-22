"use strict";

import {
  fillAbandonedColumn,
  fillAbandonedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillCurrentlyPlayingGamesCountLiteral,
  fillDataFields,
  fillFinishedGamesCountLiteral,
  fillGamesByPlatformCompletedPercent,
  fillGamesByPlatformCountLiteral,
  fillGamesByPlatformProgressBar,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPendingGamesCountLiteral,
  fillPlatformName,
  fillSearchComponent,
  fillTableRows,
  filterGamesBy,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
