"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillSearchComponent,
  fillTableRows,
  fillWishlistedGamesCountLiteral,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
