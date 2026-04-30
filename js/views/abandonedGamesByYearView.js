"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillAbandonedGamesByYearCountLiteral,
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

export function fillAbandonedGamesByYearTemplate(
  year,
  from,
  fromId,
  filter,
  filterValue,
  pageNumber,
  platformId = null
) {
  let sourceId = "abandoned-games-by-year";

  const allGames = appData.user.games.abandonedByYear(year);
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
    (content) => fillAbandonedGamesByYearCountLiteral(content, year),
    (content) => fillYear(content, year),
    (content) => fillYearSelectorComponent(content, sourceId),
    (content) =>
      fillPlatformFilterComponent(content, allGames, sourceId, {
        year,
        currentPlatformId: platformId,
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
          gameTimeFilter: true,
        },
        { from, fromId, filter, filterValue, year, platformId }
      ),
  ];

  return renderMarkup(sourceId, transformations);
}
