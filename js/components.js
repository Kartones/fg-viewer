"use strict";

function nextStateOf(desiredFilter, currentfilter, currentState) {
  if (desiredFilter !== currentfilter) {
    return "ascending";
  } else {
    return (currentState || "ascending") === "ascending"
      ? "descending"
      : "ascending";
  }
}

function titleSuffixOf(desiredFilter, currentfilter, currentState) {
  if (desiredFilter !== currentfilter) {
    return "";
  } else {
    if (desiredFilter === "name") {
      return (currentState || "ascending") === "ascending"
        ? '<span class="dir">▼</span>'
        : '<span class="dir">▲</span>';
    } else {
      switch (currentState) {
        case "ascending":
          return '<span class="dir">▼</span>';
        case "descending":
          return '<span class="dir">▲</span>';
        default:
          return "";
      }
    }
  }
}

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
            <a class="nes-btn is-primary" href="${gameUrls[key]}" target="_blank" rel="noreferrer noopener">${key}</a>
        </li>`
      )
      .join("")
  );
}

function getGameStatusRow(
  userGame,
  filters = { currentlyPlaying: true, finished: true, abandoned: true }
) {
  let markup = "";

  if (filters.currentlyPlaying) {
    markup += `<td class="is-centered"><i class="nes-icon snes-pad ${
      userGame.currently_playing ? "" : "is-empty is-half-transparent"
    }" title="${
      userGame.currently_playing ? "" : "Not "
    }Currently playing"></i></td>`;
  }

  if (filters.finished) {
    markup += `<td class="is-centered"><i class="nes-icon trophy ${
      userGame.finished ? "" : "is-empty is-half-transparent"
    }" title="${userGame.finished ? "" : "Not "}Finished"></i></td>`;
  }

  if (filters.abandoned) {
    markup += `<td class="is-centered"><i class="nes-icon skull ${
      userGame.abandoned ? "" : "is-empty is-half-transparent"
    }" title="${userGame.abandoned ? "Abandoned" : "Pending"}"></i></td>`;
  }

  return markup;
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

export function fillCatalogGamesCount(content) {
  return content.replaceAll(
    "{{js-games-count}}",
    `<strong>${appData.user.games.count}</strong> ${pluralize(
      "game",
      appData.user.games
    )}`
  );
}

export function fillCatalogAutoExcludeCurrentValue(content) {
  return content.replace(
    "{{js-auto-exclude}}",
    appData.preferences.shouldAutoExclude() ? "checked" : ""
  );
}

export function fillAbandonedColumn(
  content,
  autoExcludeValue,
  hasPlatformId = false
) {
  const linkDestination = hasPlatformId
    ? "user-games-by-platform"
    : "user-games";

  return content.replace(
    "{{js-abandoned-column}}",
    autoExcludeValue
      ? ""
      : `
  <th>
  <a up-emit="link:${linkDestination}" up-emit-props='{"transition":"cross-fade" }' data-filter="abandoned" data-filter-value="{{js-abandoned-filter-value}}" ${
          hasPlatformId ? 'data-id="{{js-id}}"' : ""
        } data-from="{{js-from}}" data-from-id="{{js-from-id}}" href="#"><i class="nes-icon skull" title="Abandoned"></i>{{js-abandoned-filter-title-suffix}}</a>
  </th>
  `
  );
}

export function fillCatalogPlatformsCount(content) {
  return content.replaceAll(
    "{{js-platforms-count}}",
    `<strong>${appData.user.platforms.count}</strong> ${pluralize(
      "platform",
      appData.user.platforms
    )}`
  );
}

export function fillCatalogGamesCompletedPercent(content) {
  return content.replaceAll(
    "{{js-games-completed-percent}}",
    `${appData.user.games.completedCatalogPercent()}%`
  );
}

export function fillGamesByPlatformCompletedPercent(content, platformId) {
  return content.replaceAll(
    "{{js-games-completed-percent}}",
    `${appData.user.games.completedPlatformCatalogPercent(platformId)}%`
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

export function fillDataFields(content, fields = {}, values = {}) {
  fields = {
    ...{
      from: true,
      fromId: true,
      platformId: false, // `id`
      nameFilter: true,
      platformFilter: false,
      currentlyPlayingFilter: false,
      finishedFilter: false,
      abandonedFilter: false,
    },
    ...fields,
  };

  if (fields.from) {
    content = content.replaceAll("{{js-from}}", values.from);
  }
  if (fields.fromId) {
    content = content.replaceAll("{{js-from-id}}", values.fromId);
  }
  if (fields.platformId) {
    content = content.replaceAll("{{js-id}}", values.platformId);
  }
  if (fields.nameFilter) {
    content = content.replaceAll(
      "{{js-name-filter-value}}",
      nextStateOf("name", values.filter, values.filterValue)
    );
    content = content.replaceAll(
      "{{js-name-filter-title-suffix}}",
      titleSuffixOf("name", values.filter, values.filterValue)
    );
  }
  if (fields.platformFilter) {
    content = content.replaceAll(
      "{{js-platform-filter-value}}",
      nextStateOf("platform", values.filter, values.filterValue)
    );
    content = content.replaceAll(
      "{{js-platform-filter-title-suffix}}",
      titleSuffixOf("platform", values.filter, values.filterValue)
    );
  }
  if (fields.finishedFilter) {
    content = content.replaceAll(
      "{{js-finished-filter-value}}",
      nextStateOf("finished", values.filter, values.filterValue)
    );
    content = content.replaceAll(
      "{{js-finished-filter-title-suffix}}",
      titleSuffixOf("finished", values.filter, values.filterValue)
    );
  }
  if (fields.currentlyPlayingFilter) {
    content = content.replaceAll(
      "{{js-currently-playing-filter-value}}",
      nextStateOf("currentlyPlaying", values.filter, values.filterValue)
    );
    content = content.replaceAll(
      "{{js-currently-playing-filter-title-suffix}}",
      titleSuffixOf("currentlyPlaying", values.filter, values.filterValue)
    );
  }
  if (fields.abandonedFilter) {
    content = content.replaceAll(
      "{{js-abandoned-filter-value}}",
      nextStateOf("abandoned", values.filter, values.filterValue)
    );
    content = content.replaceAll(
      "{{js-abandoned-filter-title-suffix}}",
      titleSuffixOf("abandoned", values.filter, values.filterValue)
    );
  }

  return content;
}

export function fillTableRows(
  content,
  items,
  sourceId,
  columns = {},
  options = {}
) {
  columns = {
    ...{
      platformLongName: false,
      platformShortName: false,
      gameName: false,
      gameStatusAll: false,
      gameStatusCurrentlyPlaying: false,
      gameStatusFinished: false,
    },
    ...columns,
  };
  options = {
    ...{
      isPlatformsList: false,
      gameId: null,
    },
    ...options,
  };

  let itemsFragment;

  if (options.isPlatformsList) {
    itemsFragment = items
      .map((platformId) => {
        let row = "<tr>";

        if (columns.platformLongName) {
          row += `<td>
          ${linkToUserGamesByPlatform(
            platformId,
            true,
            sourceId,
            options.gameId
          )}
          </td>`;
        }

        row += "</tr>";
        return row;
      })
      .join("");
  } else {
    itemsFragment = items
      .map((game) => {
        let row = `<tr ${
          game.finished
            ? 'class="row-finished"'
            : game.abandoned
            ? 'class="row-abandoned"'
            : ""
        }>`;

        if (columns.gameName) {
          row += `<td>${linkToGameDetails(game.game_id, sourceId)}</td>`;
        }
        if (columns.platformShortName) {
          row += `<td class="is-centered">
          ${linkToUserGamesByPlatform(game.platform_id, false, sourceId)}
          </td>`;
        }
        if (columns.gameStatusAll) {
          row += getGameStatusRow(game);
        } else {
          row += getGameStatusRow(game, {
            currentlyPlaying: columns.gameStatusCurrentlyPlaying,
            finished: columns.gameStatusFinished,
            abandoned: false,
          });
        }

        row += "</tr>";

        return row;
      })
      .join("");
  }

  return content.replace("{{js-table-rows}}", itemsFragment);
}

function linkToGameDetails(gameId, from, fromId = null) {
  const fromIdFragment = fromId ? `data-from-id="${fromId}"` : "";

  return `<a up-emit="link:game-details" data-id="${gameId}" data-from="${from}" ${fromIdFragment} href="#">${appData.games[gameId].name}</a>`;
}

function linkToUserGamesByPlatform(
  platformId,
  useLongName,
  from,
  fromId = null
) {
  const fromIdFragment = fromId ? `data-from-id="${fromId}"` : "";
  const name = useLongName
    ? appData.platforms[platformId].name
    : appData.platforms[platformId].shortname;

  return `<a up-emit="link:user-games-by-platform" data-id="${platformId}" data-from="${from}" ${fromIdFragment} href="#">${name}</a>`;
}

export function filterGamesBy(games, field, value) {
  if (field !== "abandoned") {
    throw new Error(`Filter "${field} not supported`);
  }

  if (value !== true) {
    return games;
  }
  return games.filter((game) => !game.abandoned);
}

// Used both for user games and wishlisted games
export function sortGamesBy(games, field, value) {
  const nameAscending = (game1, game2) =>
    appData.games[game1.game_id].name.localeCompare(
      appData.games[game2.game_id].name
    );
  const nameDescending = (game1, game2) =>
    appData.games[game2.game_id].name.localeCompare(
      appData.games[game1.game_id].name
    );

  // only actually change order if there's a difference between both
  const currentlyPlaying = (game1, game2) => {
    if (game1.currently_playing && !game2.currently_playing) {
      return -1;
    }
    if (game2.currently_playing && !game1.currently_playing) {
      return 1;
    }
    return 0;
  };
  const notCurrentlyPlaying = (game1, game2) => {
    if (!game1.currently_playing && game2.currently_playing) {
      return -1;
    }
    if (!game2.currently_playing && game1.currently_playing) {
      return 1;
    }
    return 0;
  };

  const finished = (game1, game2) => {
    if (game1.finished && !game2.finished) {
      return -1;
    }
    if (game2.finished && !game1.finished) {
      return 1;
    }
    return 0;
  };
  const notFinished = (game1, game2) => {
    if (!game1.finished && game2.finished) {
      return -1;
    }
    if (!game2.finished && game1.finished) {
      return 1;
    }
    return 0;
  };

  const abandoned = (game1, game2) => {
    if (game1.abandoned && !game2.abandoned) {
      return -1;
    }
    if (game2.abandoned && !game1.abandoned) {
      return 1;
    }
    return 0;
  };
  const notAbandoned = (game1, game2) => {
    if (!game1.abandoned && game2.abandoned) {
      return -1;
    }
    if (!game2.abandoned && game1.abandoned) {
      return 1;
    }
    return 0;
  };

  const platformShortNameAscending = (game1, game2) =>
    appData.platforms[game1.platform_id].shortname.localeCompare(
      appData.platforms[game2.platform_id].shortname
    );
  const platformShortNameDescending = (game1, game2) =>
    appData.platforms[game2.platform_id].shortname.localeCompare(
      appData.platforms[game1.platform_id].shortname
    );

  const items = [...games];

  switch (field) {
    case "name":
      if (value === "descending") {
        items.sort(nameDescending);
      } else {
        items.sort(nameAscending);
      }
      break;
    case "currentlyPlaying":
      if (value === "descending") {
        items.sort(notCurrentlyPlaying);
      } else {
        items.sort(currentlyPlaying);
      }
      break;
    case "finished":
      if (value === "descending") {
        items.sort(notFinished);
      } else {
        items.sort(finished);
      }
      break;
    case "abandoned":
      if (value === "descending") {
        items.sort(notAbandoned);
      } else {
        items.sort(abandoned);
      }
      break;
    case "platform":
      if (value === "descending") {
        items.sort(platformShortNameDescending);
      } else {
        items.sort(platformShortNameAscending);
      }
  }

  return items;
}

export function sortPlatformsBy(platforms, _field, value) {
  const nameAscending = (platformId1, platformId2) =>
    appData.platforms[platformId1].name.localeCompare(
      appData.platforms[platformId2].name
    );

  const nameDescending = (platformId1, platformId2) =>
    appData.platforms[platformId2].name.localeCompare(
      appData.platforms[platformId1].name
    );

  const items = [...platforms];

  // currently only sorting by name
  if (value === "descending") {
    items.sort(nameDescending);
  } else {
    items.sort(nameAscending);
  }

  return items;
}

export function fillPaginationBlock(
  content,
  pagination,
  emitUrl,
  from,
  fromId,
  filter,
  filterValue,
  platformId = null
) {
  if (pagination.total === 1) {
    return content.replace("{{js-pagination}}", "");
  }

  const dataId = platformId ? `data-id="${platformId}"` : "";

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

export function paginate(items, options = {}) {
  options = {
    pageNumber: 0,
    pageSize: 50,
    ...options,
  };
  let response = {
    items: [],
    current: 0,
    prev: null,
    next: null,
    total: 1,
  };

  if (items.length === 0) {
    return response;
  }

  options.pageSize = Math.min(Math.max(1, options.pageSize), items.length);

  response.total = Math.ceil(items.length / options.pageSize);

  options.pageNumber = Math.min(
    Math.max(0, options.pageNumber),
    response.total - 1
  );

  response.items = items.slice(
    options.pageNumber * options.pageSize,
    Math.min((options.pageNumber + 1) * options.pageSize, items.length)
  );

  response.current = options.pageNumber;

  if (response.current > 0 && response.total > 1) {
    response.prev = response.current - 1;
  }

  if (response.current < response.total - 1) {
    response.next = response.current + 1;
  }

  return response;
}

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
