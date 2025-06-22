"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPendingGamesCountLiteral,
  fillSearchComponent,
  fillTableRows,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
