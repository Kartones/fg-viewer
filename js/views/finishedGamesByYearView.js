"use strict";

import {
  fillAbandonedColumn,
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillFinishedGamesByYearCountLiteral,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPlatformFilterComponent,
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
  pageNumber,
  platformId = null
) {
  let sourceId = "finished-games-by-year";

  const autoExcludeAbandoned = appData.preferences.shouldAutoExclude();

  const allGames = appData.user.games.finishedByYear(year, autoExcludeAbandoned);
  const games = platformId
    ? allGames.filter((game) => game.platform_id === platformId)
    : allGames;

  const pagination = paginate(sortGamesBy(games, filter, filterValue), {
    pageNumber,
    useIndexes: true,
  });

  const transformations = [
    fillCapitalizedUserName,
    fillBackButton,
    (content) => fillPaginationIndexes(content, pagination.indexes),
    (content) => fillFinishedGamesByYearCountLiteral(content, year),
    (content) => fillYear(content, year),
    (content) => fillYearSelectorComponent(content, sourceId),
    (content) =>
      fillPlatformFilterComponent(content, allGames, sourceId, {
        year,
        currentPlatformId: platformId,
      }),
    (content) =>
      fillAbandonedColumn(content, autoExcludeAbandoned, false, sourceId),
    (content) =>
      fillTableRows(content, pagination.items, sourceId, {
        gameName: true,
        platformShortName: true,
        gameStatusFinished: true,
        gameStatusAbandoned: !autoExcludeAbandoned,
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
        year,
        platformId
      ),
    (content) =>
      fillDataFields(
        content,
        {
          platformFilter: true,
          platformIdFilter: true,
          finishedFilter: true,
          abandonedFilter: true,
          gameTimeFilter: true,
        },
        { from, fromId, filter, filterValue, year, platformId }
      ),
  ];

  return renderMarkup(sourceId, transformations);
}
