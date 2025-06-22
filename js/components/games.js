"use strict";

function linkToGameDetails(gameId, from, fromId = null) {
  const fromIdFragment = fromId ? `data-from-id="${fromId}"` : "";

  return `<a up-emit="link:game-details" data-id="${gameId}" data-from="${from}" ${fromIdFragment} href="#">${appData.games[gameId].name}</a>`;
}

export { linkToGameDetails };

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
  gameUrls[
    "StragegyWiki"
  ] = `https://strategywiki.org/w/index.php?title=Special:Search&profile=default&search=${urlEncodedName}&fulltext=1`;

  gameUrls[
    "Before I Play"
  ] = `https://beforeiplay.com/index.php?title=Special:Search&profile=default&search=${urlEncodedName}&fulltext=1`;

  if (game.platforms.includes(3)) {
    // only for PC
    gameUrls[
      "PCGamingWiki"
    ] = `https://www.pcgamingwiki.com/w/index.php?search=${urlEncodedName}&title=Special%3ASearch`;
  }
  if (game.platforms.includes(10)) {
    // only for Playstation 2
    gameUrls[
      "PCSX2Wiki"
    ] = `https://wiki.pcsx2.net/index.php?search=${urlEncodedName}&title=Special%3ASearch`;
  }

  return content.replaceAll(
    "{{js-game-urls}}",
    Object.keys(gameUrls)
      .map(
        (key) => `
        <li>
            <a class="nes-btn is-primary" href="${gameUrls[key]}" target="_blank" rel="noreferrer noopener">${key}</a>
        </li>`
      )
      .join("")
  );
}

export function fillRandomGame(content) {
  const gameIds = Object.keys(appData.games);
  const numGames = gameIds.length;
  const chosenGameIndex = Math.floor(Math.random() * (numGames + 1));

  const replacement = appData.games[gameIds[chosenGameIndex]].name;

  return content.replace("{{js-random-game}}", replacement);
}
