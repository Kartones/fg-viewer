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
    switch (currentState) {
      case "ascending":
        return ["name", "platform"].includes(desiredFilter)
          ? "↓"
          : '<span class="dir">↓</span>';
      case "descending":
        return ["name", "platform"].includes(desiredFilter)
          ? "↑"
          : '<span class="dir">↑</span>';
      default:
        return desiredFilter === "name" ? "↓" : "";
    }
  }
}

export function fillSearchComponent(content, from, fromId = null) {
  const autoExcludeAbandoned = appData.preferences.shouldAutoExclude();

  const filter = "name";

  let games;
  switch (from) {
    case "currently-playing-games":
      games = sortGamesBy(appData.user.games.currentlyPlaying(), filter);
      break;
    case "user-games":
      games = sortGamesBy(
        Object.values(appData.games).map((game) => ({
          game_id: game.id,
          name: game.name,
        })),
        filter
      );
      break;
    case "finished-games":
      games = sortGamesBy(appData.user.games.finished(), filter);
      break;
    case "pending-games":
      games = sortGamesBy(appData.user.games.pending(), filter);
      break;
    case "wishlisted-games":
      games = sortGamesBy(appData.user.wishlistedGames.items, filter);
      break;
    case "abandoned-games":
      games = sortGamesBy(appData.user.games.abandoned(), filter);
      break;
    case "user-games-by-platform":
      games = sortGamesBy(
        filterGamesBy(
          appData.user.games.byPlatform(fromId),
          "abandoned",
          autoExcludeAbandoned
        ),
        filter
      );
      break;
    default:
      up.emit("feedback:error", { message: "Error populating the search box" });
      console.error("Unrecognized 'from' value: ", from);
      games = [];
  }

  return content.replace(
    "{{js-game-search}}",
    `<div class="select"><select id="gameSearch" data-from="${from}" data-from-id="${fromId}">
    <option value="-1"> </option>
    ${games
      .map(
        (userGame) =>
          `<option value="${userGame.game_id}">${
            appData.games[userGame.game_id].name
          }</option>`
      )
      .join("")}
    </select></div>`
  );
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
  gameUrls[
    "StragegyWiki"
  ] = `https://strategywiki.org/w/index.php?title=Special:Search&profile=default&search=${urlEncodedName}&fulltext=1`;

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
      platformGameStatusAll: false,
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
      fromPlatformId: null,
      gameId: null,
      userGames: null,
    },
    ...options,
  };

  let itemsFragment;

  if (options.isPlatformsList) {
    itemsFragment = items
      .map((platformId) => {
        let userGame;
        let row = "<tr>";

        if (columns.platformGameStatusAll) {
          userGame = options.userGames?.find(
            (userGame) => userGame.platform_id === platformId
          );

          row = `<tr ${
            userGame && userGame.finished ? 'class="row-finished"' : ""
          }>`;
        }

        if (columns.platformLongName) {
          row += `<td>
          ${linkToUserGamesByPlatform(platformId, sourceId, {
            useLongName: true,
            fromId: options.gameId,
          })}
          </td>`;
        }

        if (columns.platformGameStatusAll) {
          if (!userGame) {
            row += "<td></td><td></td><td></td><td></td><td></td>";
          } else {
            row += `
            <td>${
              !userGame.finished && !userGame.wishlisted && !userGame.abandoned
                ? '<i class="nes-icon trophy is-empty" title="Pending"></i>'
                : ""
            }</td>
            <td>${
              userGame.currently_playing
                ? '<i class="nes-icon snes-pad" title="Currently playing"></i>'
                : ""
            }</td>
            <td>${
              userGame.finished
                ? '<i class="nes-icon trophy" title="Finished"></i>'
                : ""
            }</td>
            <td>${
              userGame.abandoned
                ? '<i class="nes-icon skull" title="Abandoned"></i>'
                : ""
            }</td>
            <td>${
              userGame.wishlisted
                ? '<i class="nes-icon heart" title="Wishlisted"></i>'
                : ""
            }</td>
            `;
          }
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
          row += `<td>${linkToGameDetails(
            game.game_id,
            sourceId,
            options.fromPlatformId
          )}</td>`;
        }
        if (columns.platformShortName) {
          row += `<td class="is-centered">
          ${linkToUserGamesByPlatform(game.platform_id, sourceId, {
            useLongName: false,
          })}
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

function linkToUserGamesByPlatform(platformId, from, options = {}) {
  options = {
    nameOverride: null,
    useLongName: false,
    fromId: null,
    page: null,
    ...options,
  };

  const fromIdFragment = options.fromId
    ? `data-from-id="${options.fromId}"`
    : "";

  const pageFragment = options.page ? `data-page="${options.page}"` : "";

  const name = options.nameOverride
    ? options.nameOverride
    : options.useLongName
    ? appData.platforms[platformId].name
    : appData.platforms[platformId].shortname;

  return `<a up-emit="link:user-games-by-platform" data-id="${platformId}" data-from="${from}" ${fromIdFragment} ${pageFragment} href="#">${name}</a>`;
}

export function fillRandomGame(content) {
  const gameIds = Object.keys(appData.games);
  const numGames = gameIds.length;
  const chosenGameIndex = Math.floor(Math.random() * (numGames + 1));

  const replacement = appData.games[gameIds[chosenGameIndex]].name;

  return content.replace("{{js-random-game}}", replacement);
}

export function filterGamesBy(games, field, value) {
  switch (field) {
    case "abandoned":
      if (value !== true) {
        return games;
      }
      return games.filter((game) => !game.abandoned);
    case "game_id":
      return games.filter((game) => game.game_id === value);
    default:
      throw new Error(`Filter "${field} not supported`);
  }
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
    "currently-playing-games",
    "pending-games",
    "abandoned-games",
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

export function paginate(items, options = {}) {
  options = {
    pageNumber: 0,
    pageSize: 100,
    useIndexes: false,
    ...options,
  };
  let response = {
    items: [],
    current: 0,
    prev: null,
    next: null,
    total: 1,
    indexes: {},
  };

  if (items.length === 0) {
    return response;
  }

  options.pageSize = Math.min(Math.max(1, options.pageSize), items.length);

  response.total = Math.ceil(items.length / options.pageSize);

  if (options.useIndexes) {
    response.indexes = {
      0: 0,
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
      K: 0,
      L: 0,
      M: 0,
      N: 0,
      O: 0,
      P: 0,
      Q: 0,
      R: 0,
      S: 0,
      T: 0,
      U: 0,
      V: 0,
      W: 0,
      X: 0,
      Y: 0,
      Z: 0,
    };
    Object.keys(response.indexes).forEach((index) => {
      const position = items.findIndex((item) =>
        appData.games[item.game_id].name.startsWith(index)
      );
      if (position > 0) {
        response.indexes[index] = Math.floor(position / options.pageSize);
      }
    });
  }

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
