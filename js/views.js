"use strict";

// Re-export all view functions from individual files
export { fillUserPlatformsTemplate } from "./views/userPlatformsView.js";
export { fillUserGamesTemplate } from "./views/userGamesView.js";
export { fillUserGamesByPlatformTemplate } from "./views/userGamesByPlatformView.js";
export { fillGameDetailsTemplate } from "./views/gameDetailsView.js";
export { fillAbandonedGamesTemplate } from "./views/abandonedGamesView.js";
export { fillCurrentlyPlayingGamesTemplate } from "./views/currentlyPlayingGamesView.js";
export { fillPendingGamesTemplate } from "./views/pendingGamesView.js";
export { fillFinishedGamesByYearTemplate } from "./views/finishedGamesByYearView.js";
export { fillFinishedGamesTemplate } from "./views/finishedGamesView.js";
export { fillWishlistedGamesTemplate } from "./views/wishlistedGamesView.js";
export { fillCatalogTemplate } from "./views/catalogView.js";
export { fillRandomGameTemplate } from "./views/randomGameView.js";

// Re-export the renderMarkup utility function
export { renderMarkup } from "./views/utils.js";
