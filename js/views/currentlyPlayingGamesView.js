"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillCurrentlyPlayingGamesCountLiteral,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillSearchComponent,
  fillTableRows,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
          finishedFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup(sourceId, operations);
}
