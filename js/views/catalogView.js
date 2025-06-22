"use strict";

import {
  fillAbandonedGamesCountLiteral,
  fillCapitalizedUserName,
  fillCatalogAutoExcludeCurrentValue,
  fillCatalogGamesCompletedPercent,
  fillCatalogGamesCount,
  fillCatalogGamesProgressBar,
  fillCatalogPlatformsCount,
  fillCurrentlyPlayingGamesCountLiteral,
  fillFinishedGamesCountLiteral,
  fillOptionalCatalogHeader,
  fillPendingGamesCountLiteral,
  fillWishlistedGamesCountLiteral,
} from "../components.js";
import { renderMarkup } from "./utils.js";

export function fillCatalogTemplate() {
  const sourceId = "catalog";

  const transformations = [
    fillCatalogGamesCount,
    fillCatalogPlatformsCount,
    fillCatalogGamesCompletedPercent,
    fillCapitalizedUserName,
    fillCurrentlyPlayingGamesCountLiteral,
    fillPendingGamesCountLiteral,
    fillFinishedGamesCountLiteral,
    fillAbandonedGamesCountLiteral,
    fillWishlistedGamesCountLiteral,
    fillCatalogGamesProgressBar,
    fillCatalogAutoExcludeCurrentValue,
    fillOptionalCatalogHeader,
  ];

  return renderMarkup(sourceId, transformations);
}
