"use strict";

import {
  fillAbandonedGamesCountLiteral,
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPlatformFilterComponent,
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
  pageNumber,
  platformId = null
) {
  let sourceId = "abandoned-games";

  const allGames = appData.user.games.abandoned();
  const games = platformId
    ? allGames.filter((game) => game.platform_id === platformId)
    : allGames;

  const pagination = paginate(sortGamesBy(games, filter, filterValue), {
    pageNumber,
    useIndexes: true,
  });

  const operations = [
    fillCapitalizedUserName,
    fillAbandonedGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPlatformFilterComponent(content, allGames, sourceId, {
        currentPlatformId: platformId,
      }),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "abandoned-games",
        from,
        platformId,
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
        null,
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
        { from, fromId, filter, filterValue, platformId }
      ),
  ];

  return renderMarkup(sourceId, operations);
}
