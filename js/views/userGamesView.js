"use strict";

import {
  fillAbandonedColumn,
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillSearchComponent,
  fillTableRows,
  filterGamesBy,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
        gameTime: true,
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
