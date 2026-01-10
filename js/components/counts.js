"use strict";

import { pluralize } from "./utils.js";

export function fillCurrentlyPlayingGamesCountLiteral(
  content,
  platformId = null
) {
  const items = platformId
    ? appData.user.games.currentlyPlayingByPlatform(platformId)
    : appData.user.games.currentlyPlaying();
  return content.replaceAll(
    "{{js-currently-playing-games-count}}",
    `<strong>${items.length}</strong> currently playing ${pluralize(
      "game",
      items
    )}`
  );
}

export function fillFinishedGamesCountLiteral(content, platformId = null) {
  const items = platformId
    ? appData.user.games.finishedByPlatform(platformId)
    : appData.user.games.finished();
  return content.replaceAll(
    "{{js-finished-games-count}}",
    `<strong>${items.length}</strong> finished ${pluralize("game", items)}`
  );
}

export function fillFinishedGamesByYearCountLiteral(content, year) {
  const items = appData.user.games.finishedByYear(year);
  return content.replaceAll(
    "{{js-finished-games-by-year-count}}",
    `<strong>${items.length}</strong> finished ${pluralize(
      "game",
      items
    )} in ${year}`
  );
}

export function fillAbandonedGamesCountLiteral(content, platformId = null) {
  const items = platformId
    ? appData.user.games.abandonedByPlatform(platformId)
    : appData.user.games.abandoned();
  return content.replaceAll(
    "{{js-abandoned-games-count}}",
    `<strong>${items.length}</strong> abandoned ${pluralize("game", items)}`
  );
}

export function fillAbandonedGamesByYearCountLiteral(content, year) {
  const items = appData.user.games.abandonedByYear(year);
  return content.replaceAll(
    "{{js-abandoned-games-by-year-count}}",
    `<strong>${items.length}</strong> abandoned ${pluralize(
      "game",
      items
    )} in ${year}`
  );
}

export function fillPendingGamesCountLiteral(content, platformId = null) {
  const items = platformId
    ? appData.user.games.pendingByPlatform(platformId)
    : appData.user.games.pending();
  return content.replaceAll(
    "{{js-pending-games-count}}",
    `<strong>${items.length}</strong> pending ${pluralize("game", items)}`
  );
}

export function fillWishlistedGamesCountLiteral(content, platformId = null) {
  const items = platformId
    ? appData.user.wishlistedGames.items
    : appData.user.wishlistedGames.items;
  return content.replaceAll(
    "{{js-wishlisted-games-count}}",
    `<strong>${items.length}</strong> wishlisted ${pluralize("game", items)}`
  );
}

export function fillGamesByPlatformCountLiteral(content, platformId) {
  const items = appData.user.games.byPlatform(platformId);

  return content.replaceAll(
    "{{js-games-by-platform-count}}",
    `<strong>${items.length}</strong> ${pluralize("game", items)}`
  );
}
