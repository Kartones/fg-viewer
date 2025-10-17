"use strict";

import { pluralize, formatGameTime } from "./utils.js";

export function fillCatalogGamesCount(content) {
  return content.replaceAll(
    "{{js-games-count}}",
    `<strong>${appData.user.games.count}</strong> ${pluralize(
      "game",
      appData.user.games
    )}`
  );
}

export function fillCatalogPlatformsCount(content) {
  return content.replaceAll(
    "{{js-platforms-count}}",
    `<strong>${appData.user.platforms.count}</strong> ${pluralize(
      "platform",
      appData.user.platforms
    )}`
  );
}

export function fillCatalogGamesCompletedPercent(content) {
  return content.replaceAll(
    "{{js-games-completed-percent}}",
    `${appData.user.games.completedCatalogPercent()}%`
  );
}

export function fillCatalogAutoExcludeCurrentValue(content) {
  return content.replace(
    "{{js-auto-exclude}}",
    appData.preferences.shouldAutoExclude() ? "checked" : ""
  );
}

export function fillCapitalizedUserName(content) {
  return content.replaceAll(
    "{{js-username}}",
    `<span class="username">${appData.user.username}</span>`
  );
}

export function fillOptionalCatalogHeader(content) {
  let replacement = "";

  if (appData.preferences.showCatalogHeader) {
    replacement = fillCapitalizedUserName(`<h2>{{js-username}} Catalog</h2>`);
  }

  return content.replace("{{js-optional-catalog-header}}", replacement);
}

export function fillTotalGameTime(content) {
  const totalMinutes = appData.user.games.items.reduce(
    (sum, game) => sum + (game.minutes_played || 0),
    0
  );
  return content.replaceAll(
    "{{js-total-game-time}}",
    formatGameTime(totalMinutes, true)
  );
}
