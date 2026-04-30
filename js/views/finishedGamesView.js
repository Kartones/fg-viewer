"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillFinishedGamesCountLiteral,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPlatformFilterComponent,
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
  pageNumber,
  platformId = null
) {
  let sourceId = "finished-games";

  const allGames = appData.user.games.finished();
  const games = platformId
    ? allGames.filter((game) => game.platform_id === platformId)
    : allGames;

  const pagination = paginate(sortGamesBy(games, filter, filterValue), {
    pageNumber,
    useIndexes: true,
  });

  const transformations = [
    fillCapitalizedUserName,
    fillFinishedGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPlatformFilterComponent(content, allGames, sourceId, {
        currentPlatformId: platformId,
      }),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "finished-games",
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
