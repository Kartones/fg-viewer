"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillFinishedGamesCountLiteral,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillSearchComponent,
  fillTableRows,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
          gameTimeFilter: true,
        },
        { from, fromId, filter, filterValue }
      ),
  ];

  return renderMarkup(sourceId, transformations);
}
