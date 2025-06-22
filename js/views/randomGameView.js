"use strict";

import { fillBackButton, fillRandomGame } from "../components.js";
import { renderMarkup } from "./utils.js";

export function fillRandomGameTemplate() {
  const sourceId = "random-game";

  const transformations = [fillBackButton, fillRandomGame];

  return renderMarkup(sourceId, transformations);
}
