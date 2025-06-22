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

export { nextStateOf, titleSuffixOf };

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
