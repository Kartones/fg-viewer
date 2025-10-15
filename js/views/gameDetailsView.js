"use strict";

import {
  fillBackButton,
  fillGameDLCBlock,
  fillGameName,
  fillGamePublishDate,
  fillGameURLs,
  fillTableRows,
  filterGamesBy,
  sortPlatformsBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

export function fillGameDetailsTemplate(gameId, from, fromId) {
  const sourceId = "game-details";

  const gamePlatforms = sortPlatformsBy(
    appData.games[gameId].platforms,
    "name"
  );

  const userGames = filterGamesBy(
    appData.user.games.items,
    "game_id",
    gameId
  ).map((game) => ({
    platform_id: game.platform_id,
    finished: game.finished,
    currently_playing: game.currently_playing,
    abandoned: game.abandoned,
    wishlisted: false,
    minutes_played: game.minutes_played,
  }));

  const userWishlistedGames = filterGamesBy(
    appData.user.wishlistedGames.items,
    "game_id",
    gameId
  ).map((game) => ({
    platform_id: game.platform_id,
    finished: false,
    currently_playing: false,
    abandoned: false,
    wishlisted: true,
    minutes_played: 0,
  }));

  const operations = [
    (content) =>
      fillTableRows(
        content,
        gamePlatforms,
        sourceId,
        {
          platformLongName: true,
          platformGameStatusAll: true,
          gameTime: true,
        },
        {
          isPlatformsList: true,
          gameId,
          userGames: userGames.concat(userWishlistedGames),
        }
      ),
    (content) => fillGameName(content, gameId),
    (content) => fillGameDLCBlock(content, gameId, sourceId),
    (content) => fillBackButton(content, from, fromId),
    (content) => fillGamePublishDate(content, gameId),
    (content) => fillGameURLs(content, gameId),
  ];

  return renderMarkup(sourceId, operations);
}
