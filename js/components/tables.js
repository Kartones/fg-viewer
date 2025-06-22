"use strict";

import { nextStateOf, titleSuffixOf } from "./data.js";
import { linkToGameDetails } from "./games.js";
import { linkToUserGamesByPlatform } from "./platforms.js";

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
  if (values.year) {
    content = content.replaceAll("{{js-year}}", values.year);
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
      gameStatusAbandoned: false,
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
            abandoned: columns.gameStatusAbandoned,
          });
        }

        row += "</tr>";

        return row;
      })
      .join("");
  }

  return content.replace("{{js-table-rows}}", itemsFragment);
}
