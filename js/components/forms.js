"use strict";

import { sortGamesBy, filterGamesBy } from "./data.js";

export function fillYearSelectorComponent(content) {
  const years = appData.user.games.yearsWithFinishedOrAbandonedGames();

  const yearsHTML = years
    .map(
      (year) =>
        `<a up-emit="link:finished-games-by-year" href="#" data-id="${year}">${year}</a>`
    )
    .join(" - ");

  const finalHTML = `<details>
    <summary>Navigation options</summary>
    <p class="character-filter">${yearsHTML}</p>
    </details>`;

  return content.replace("{{js-year-selector}}", finalHTML);
}

export function fillSearchComponent(content, from, fromId = null) {
  const autoExcludeAbandoned = appData.preferences.shouldAutoExclude();

  const filter = "name";

  let games;
  switch (from) {
    case "currently-playing-games":
      games = sortGamesBy(appData.user.games.currentlyPlaying(), filter);
      break;
    case "user-games":
      games = sortGamesBy(
        Object.values(appData.games).map((game) => ({
          game_id: game.id,
          name: game.name,
        })),
        filter
      );
      break;
    case "finished-games":
      games = sortGamesBy(appData.user.games.finished(), filter);
      break;
    case "pending-games":
      games = sortGamesBy(appData.user.games.pending(), filter);
      break;
    case "wishlisted-games":
      games = sortGamesBy(appData.user.wishlistedGames.items, filter);
      break;
    case "abandoned-games":
      games = sortGamesBy(appData.user.games.abandoned(), filter);
      break;
    case "user-games-by-platform":
      games = sortGamesBy(
        filterGamesBy(
          appData.user.games.byPlatform(fromId),
          "abandoned",
          autoExcludeAbandoned
        ),
        filter
      );
      break;
    default:
      up.emit("feedback:error", { message: "Error populating the search box" });
      console.error("Unrecognized 'from' value: ", from);
      games = [];
  }

  // Too few games, return early and don't show the search box
  if (games.length < 15) {
    return content.replace("{{js-game-search}}", "");
  }

  let gamesMap = games.reduce((accumulator, currentValue) => {
    return accumulator.set(
      currentValue.game_id,
      appData.games[currentValue.game_id].name
    );
  }, new Map());

  games = Array.from(gamesMap, ([id, name]) => ({ id, name }));

  return content.replace(
    "{{js-game-search}}",
    `<div class="select"><select id="gameSearch" data-from="${from}" data-from-id="${fromId}">
    <option value="-1"> </option>
    ${games
      .map((game) => `<option value="${game.id}">${game.name}</option>`)
      .join("")}
    </select></div>`
  );
}

export function fillAbandonedColumn(
  content,
  autoExcludeValue,
  hasPlatformId = false,
  sourceId = null
) {
  let linkDestination = hasPlatformId ? "user-games-by-platform" : "user-games";

  const isFinishedGamesByYear = sourceId === "finished-games-by-year";

  if (isFinishedGamesByYear) {
    linkDestination = "finished-games-by-year";
  }

  let dataIdAttribute = isFinishedGamesByYear
    ? 'data-id="{{js-year}}"'
    : hasPlatformId
    ? 'data-id="{{js-id}}"'
    : "";

  return content.replace(
    "{{js-abandoned-column}}",
    autoExcludeValue
      ? ""
      : `
  <th>
  <a up-emit="link:${linkDestination}" up-emit-props='{"transition":"cross-fade" }' data-filter="abandoned" data-filter-value="{{js-abandoned-filter-value}}" ${dataIdAttribute} data-from="{{js-from}}" data-from-id="{{js-from-id}}" href="#"><i class="nes-icon skull" title="Abandoned"></i>{{js-abandoned-filter-title-suffix}}</a>
  </th>
  `
  );
}
