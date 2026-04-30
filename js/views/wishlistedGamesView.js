"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillPaginationBlock,
  fillPaginationIndexes,
  fillPlatformFilterComponent,
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
  pageNumber,
  platformId = null
) {
  let sourceId = "wishlisted-games";

  const allGames = appData.user.wishlistedGames.items;
  const games = platformId
    ? allGames.filter((game) => game.platform_id === platformId)
    : allGames;

  const pagination = paginate(sortGamesBy(games, filter, filterValue), {
    pageNumber,
    useIndexes: true,
  });

  const transformations = [
    fillCapitalizedUserName,
    fillWishlistedGamesCountLiteral,
    fillBackButton,
    (content) => fillSearchComponent(content, sourceId),
    (content) =>
      fillPlatformFilterComponent(content, allGames, sourceId, {
        currentPlatformId: platformId,
      }),
    (content) =>
      fillPaginationIndexes(content, pagination.indexes, {
        linkDestination: "wishlisted-games",
        from,
        platformId,
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
        },
        { from, fromId, filter, filterValue, platformId }
      ),
  ];

  return renderMarkup(sourceId, transformations);
}
