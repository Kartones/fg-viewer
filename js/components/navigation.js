"use strict";

import { linkToUserGamesByPlatform } from "./platforms.js";

export function fillBackButton(content, from = "catalog", id = null) {
  const idFragment = id ? `data-id="${id}"` : "";

  return content.replace(
    "{{js-back-from}}",
    `<a class="nes-btn" up-emit="link:${from}" ${idFragment} href="#" title="Go Back">Go Back</a>`
  );
}

export function fillPaginationBlock(
  content,
  pagination,
  emitUrl,
  from,
  fromId,
  filter,
  filterValue,
  id = null
) {
  if (pagination.total === 1) {
    return content.replace("{{js-pagination}}", "");
  }

  const dataId = id ? `data-id="${id}"` : "";

  return content.replace(
    "{{js-pagination}}",
    `<p>
    <span>
    ${
      pagination.prev !== null
        ? `
        <a class="nes-btn" up-emit="link:${emitUrl}" up-emit-props='{"transition":"cross-fade" }' ${dataId} data-filter="${filter}" data-filter-value="${filterValue}" data-from="${from}" data-from-id="${fromId}" data-page="0" href="#">&laquo; first</a>
        <a class="nes-btn" up-emit="link:${emitUrl}" up-emit-props='{"transition":"cross-fade" }' ${dataId} data-filter="${filter}" data-filter-value="${filterValue}" data-from="${from}" data-from-id="${fromId}" data-page="${pagination.prev}" href="#">prev</a>
        `
        : `<a class="nes-btn is-disabled" href="#">&laquo; first</a><a class="nes-btn is-disabled" href="#">prev</a>`
    }
    <span>
        Page <strong>${pagination.current + 1}</strong> of <strong>${
      pagination.total
    }</strong>
    </span>

    ${
      pagination.next !== null
        ? `
        <a class="nes-btn" up-emit="link:${emitUrl}" up-emit-props='{"transition":"cross-fade" }' ${dataId} data-filter="${filter}" data-filter-value="${filterValue}" data-from="${from}" data-from-id="${fromId}" data-page="${
            pagination.next
          }" href="#">next</a>
        <a class="nes-btn" up-emit="link:${emitUrl}" up-emit-props='{"transition":"cross-fade" }' ${dataId} data-filter="${filter}" data-filter-value="${filterValue}" data-from="${from}" data-from-id="${fromId}" data-page="${
            pagination.total - 1
          }" href="#">last &raquo;</a>
        `
        : `<a class="nes-btn is-disabled" href="#">next</a><a class="nes-btn is-disabled" href="#">last &raquo;</a>`
    }
    </span></p>`
  );
}

export function fillPaginationIndexes(content, indexes, options = {}) {
  options = {
    linkDestination: "user-games",
    platformId: null,
    from: null,
    ...options,
  };

  // If not paginated (a single page), don't show anything
  if (typeof Object.values(indexes).find((page) => page > 0) === "undefined") {
    return content.replace("{{js-pagination-indexes}}", "");
  }

  const simpleLinkDestinations = [
    "user-games",
    "finished-games",
    "finished-games-by-year",
    "currently-playing-games",
    "pending-games",
    "abandoned-games",
    "abandoned-games-by-year",
    "wishlisted-games",
  ];

  const indexesHTML = Object.entries(indexes)
    .map(([index, page]) => {
      if (simpleLinkDestinations.includes(options.linkDestination)) {
        return `<a up-emit="link:${
          options.linkDestination
        }" href="#" data-page="${page}">${index === "0" ? "0-9" : index}</a>`;
      } else if (options.linkDestination === "user-games-by-platform") {
        return linkToUserGamesByPlatform(options.platformId, options.from, {
          page,
          nameOverride: index === "0" ? "0-9" : index,
        });
      } else {
        throw new Error(
          `Unknown fillPaginationIndexes link destination value '${options.linkDestination}'`
        );
      }
    })
    .join(" - ");

  const finalHTML = `<details>
    <summary>Navigation options</summary>
    <p class="character-filter">${indexesHTML}</p>
    </details>`;

  return content.replace("{{js-pagination-indexes}}", finalHTML);
}
