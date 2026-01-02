"use strict";

import {
  fillAbandonedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillSearchComponent,
  fillTableRows,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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

  return renderMarkup(sourceId, operations);
}
