"use strict";

import {
  fillAbandonedColumn,
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillFinishedGamesByYearCountLiteral,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillTableRows,
  fillYear,
  fillYearSelectorComponent,
  paginate,
  sortGamesBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

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
