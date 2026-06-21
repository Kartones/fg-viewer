"use strict";

function gameNameMarkdown(gameName, gameData) {
  const urls = gameData?.urls || {};
  const priority = ["website", "steam", "giant bomb"];
  for (const key of priority) {
    const match = Object.keys(urls).find(k => k.toLowerCase() === key);
    if (match) return `[${gameName}](${urls[match]})`;
  }
  return gameName;
}

function exportGamesMarkdown(games, title, filename) {
  const lines = [`# ${title}`, ""];

  const sorted = games.slice().sort((a, b) => {
    const nameA = appData.games[a.game_id]?.name ?? "";
    const nameB = appData.games[b.game_id]?.name ?? "";
    return nameA.localeCompare(nameB);
  });

  for (const game of sorted) {
    const gameData = appData.games[game.game_id];
    const gameName = gameData?.name;
    const platform = appData.platforms[game.platform_id];
    const platformName = platform?.shortname;
    if (!gameName || !platformName) continue;
    lines.push(`- ${gameNameMarkdown(gameName, gameData)} - ${platformName}`);
  }

  const markdown = lines.join("\n");
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPendingGamesMarkdown() {
  exportGamesMarkdown(appData.user.games.pending(), "pending games", "pending-games.md");
}

export function exportWishlistedGamesMarkdown() {
  exportGamesMarkdown(appData.user.wishlistedGames.items, "wishlisted games", "wishlisted-games.md");
}
