"use strict";

import {
  fillBackButton,
  fillCapitalizedUserName,
  fillDataFields,
  fillTableRows,
  sortPlatformsBy,
} from "../components.js";
import { renderMarkup } from "./utils.js";

export function fillUserPlatformsTemplate(filter, filterValue) {
  let sourceId = "user-platforms";

  const platforms = sortPlatformsBy(
    appData.user.platforms.items,
    filter,
    filterValue
  );

  const operations = [
    fillCapitalizedUserName,
    fillBackButton,
    (content) =>
      fillTableRows(
        content,
        platforms,
        sourceId,
        {
          platformLongName: true,
        },
        {
          isPlatformsList: true,
        }
      ),
    (content) =>
      fillDataFields(
        content,
        {
          from: false,
          fromId: false,
          // only has the default `nameFilter`
        },
        { filter, filterValue }
      ),
  ];

  return renderMarkup(sourceId, operations);
}
