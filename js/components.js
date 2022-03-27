"use strict";

// Fills/replacements (components)

export function fillPlatformName(content, platformId) {
  return content.replaceAll(
    "{{js-platform-name}}",
    appData.platforms[platformId].name
  );
}

export function fillGameName(content, gameId) {
  return content.replaceAll("{{js-game-name}}", appData.games[gameId].name);
}

export function fillGamePublishDate(content, gameId) {
  return content.replaceAll(
    "{{js-game-publish-date}}",
    appData.games[gameId].publish_date
  );
}

export function fillGameDLCBlock(content, gameId, from) {
  const game = appData.games[gameId];

  const replacement = game.dlc_or_expansion
    ? `
    <p>
      <strong>DLC/Expansion of</strong>: ${linkToGameDetails(
        game.parent_game,
        from,
        gameId
      )}
    </p>`
    : "";

  return content.replaceAll("{{js-game-dlc-block}}", replacement);
}

export function fillGameURLs(content, gameId) {
  const game = appData.games[gameId];
  const gameUrls = game.urls || {};
  const urlEncodedName = encodeURIComponent(game.name_for_search);

  gameUrls[
    "HowLongToBeat"
  ] = `https://howlongtobeat.com/?q=${urlEncodedName}#search`;
  gameUrls[
    "GameFAQs"
  ] = `https://gamefaqs.gamespot.com/search?game=${urlEncodedName}`;

  // only for PC (platform 3)
  if (game.platforms.includes(3)) {
    gameUrls[
      "PCGamingWiki"
    ] = `https://www.pcgamingwiki.com/w/index.php?search=${urlEncodedName}&title=Special%3ASearch`;
  }

  return content.replaceAll(
    "{{js-game-urls}}",
    Object.keys(gameUrls)
      .map(
        (key) => `
        <li>
            <a class="nes-btn is-primary" href="${gameUrls[key]}" target="_blank">${key}</a>
        </li>`
      )
      .join("")
  );
}

export function getGameStatusRow(userGame) {
  return `
  <i class="nes-icon snes-pad ${
    userGame.currently_playing ? "" : "is-empty is-half-transparent"
  }" title="${userGame.currently_playing ? "" : "Not "}Currently playing"></i>
  <i class="nes-icon trophy ${
    userGame.finished ? "" : "is-empty is-half-transparent"
  }" title="${userGame.finished ? "" : "Not "}Finished"></i>
  <i class="nes-icon skull ${
    userGame.abandoned ? "" : "is-empty is-half-transparent"
  }" title="${userGame.abandoned ? "Abandoned" : "Pending"}"></i>
  `;
}

export function fillGamesByPlatformCountLiteral(content, platformId) {
  const items = appData.user.games.byPlatform(platformId);

  return content.replaceAll(
    "{{js-games-by-platform-count}}",
    `<strong>${items.length}</strong> ${pluralize("game", items)}`
  );
}

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

export function fillAbandonedGamesCountLiteral(content, platformId = null) {
  const items = platformId
    ? appData.user.games.abandonedByPlatform(platformId)
    : appData.user.games.abandoned();
  return content.replaceAll(
    "{{js-abandoned-games-count}}",
    `<strong>${items.length}</strong> abandoned ${pluralize("game", items)}`
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

export function fillProgressBar(
  content,
  completedPercent,
  pendingItemsCount,
  totalItemsCount
) {
  return content.replaceAll(
    "{{js-user-progress}}",
    `<progress
    class="nes-progress ${progressBarClass(completedPercent)}"
    value="${completedPercent}"
    max="100"
    title="Completed ${completedPercent}% of the catalog (${
      totalItemsCount - pendingItemsCount
    }/${totalItemsCount})"
    style="margin-top: 12px"></progress>`
  );
}

export function fillCapitalizedUserName(content) {
  return content.replaceAll(
    "{{js-username}}",
    `<span class="username">${appData.user.username}</span>`
  );
}

export function fillBackButton(content, from = "catalog", id = null) {
  const idFragment = id ? `data-id="${id}"` : "";

  return content.replace(
    "{{js-back-from}}",
    `<a class="nes-btn" up-emit="link:${from}" ${idFragment} href="#" title="Go Back">Go Back</a>`
  );
}

export function linkToGameDetails(gameId, from, fromId = null) {
  const fromIdFragment = fromId ? `data-from-id="${fromId}"` : "";

  return `<a up-emit="link:game-details" data-id="${gameId}" data-from="${from}" ${fromIdFragment} href="#">${appData.games[gameId].name}</a>`;
}

export function linkToUserGamesByPlatform(
  platformId,
  longName,
  from,
  fromId = null
) {
  const fromIdFragment = fromId ? `data-from-id="${fromId}"` : "";
  const name = longName
    ? appData.platforms[platformId].name
    : appData.platforms[platformId].shortname;

  return `<a up-emit="link:user-games-by-platform" data-id="${platformId}" data-from="${from}" ${fromIdFragment} href="#">${name}</a>`;
}

// Misc.

export function pluralize(literal, target) {
  let value = 0;
  if ("items" in target) {
    value = Array.isArray(target.items)
      ? target.items.length
      : target.items.size;
  } else {
    value = Array.isArray(target) ? target.length : target.size;
  }
  return `${literal}${value === 1 ? "" : "s"}`;
}

function progressBarClass(progress) {
  if (progress <= 15) {
    return "is-error";
  } else if (progress < 35) {
    return "is-warning";
  } else if (progress < 65) {
    return "is-primary";
  } else {
    return "is-success";
  }
}
