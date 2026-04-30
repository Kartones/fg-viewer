"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPendingGamesCountLiteral,
  fillPlatformFilterComponent,
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
  pageNumber,
  platformId = null
) {
  let sourceId = "pending-games";

  const allGames = appData.user.games.pending();
  const games = platformId
    ? allGames.filter((game) => game.platform_id === platformId)
    : allGames;

  const pagination = paginate(sortGamesBy(games, filter, filterValue), {
    pageNumber,
    useIndexes: true,
  });

  const transformations = [
    fillCapitalizedUserName,
    fillPendingGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPlatformFilterComponent(content, allGames, sourceId, {
        currentPlatformId: platformId,
      }),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "pending-games",
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

  return renderMarkup(sourceId, transformations);
}
