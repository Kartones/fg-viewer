"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillAbandonedGamesByYearCountLiteral,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillTableRows,
  fillYear,
  fillYearSelectorComponent,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

export function fillAbandonedGamesByYearTemplate(
  year,
  from,
  fromId,
  filter,
  filterValue,
  pageNumber
) {
  let sourceId = "abandoned-games-by-year";

  const pagination = paginate(
    sortGamesBy(appData.user.games.abandonedByYear(year), filter, filterValue),
    { pageNumber, useIndexes: true }
  );

  const transformations = [
    fillCapitalizedUserName,
    fillBackButton,
    (content) => fillPaginationIndexes(content, pagination.indexes),
    (content) => fillAbandonedGamesByYearCountLiteral(content, year),
    (content) => fillYear(content, year),
    (content) => fillYearSelectorComponent(content, sourceId),
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
        filterValue,
        year
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
          gameTimeFilter: true,
        },
        { from, fromId, filter, filterValue, year }
      ),
  ];

  return renderMarkup(sourceId, transformations);
}
