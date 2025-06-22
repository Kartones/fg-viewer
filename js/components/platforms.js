"use strict";

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

export { linkToUserGamesByPlatform };

export function fillPlatformName(content, platformId) {
  return content.replaceAll(
    "{{js-platform-name}}",
    appData.platforms[platformId].name
  );
}
