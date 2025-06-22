"use strict";

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

function fillProgressBar(
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

export function fillCatalogGamesProgressBar(content) {
  return fillProgressBar(
    content,
    appData.user.games.completedCatalogPercent(),
    appData.user.games.pending().length,
    appData.user.games.count
  );
}

export function fillGamesByPlatformProgressBar(content, platformId) {
  return fillProgressBar(
    content,
    appData.user.games.completedPlatformCatalogPercent(platformId),
    appData.user.games.pendingByPlatform(platformId).length,
    appData.user.games.byPlatform(platformId).length
  );
}

export function fillGamesByPlatformCompletedPercent(content, platformId) {
  return content.replaceAll(
    "{{js-games-completed-percent}}",
    `${appData.user.games.completedPlatformCatalogPercent(platformId)}%`
  );
}
