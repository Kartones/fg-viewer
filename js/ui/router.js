"use strict";

import {
  fillGameDetailsTemplate,
  fillAbandonedGamesTemplate,
  fillCurrentlyPlayingGamesTemplate,
  fillPendingGamesTemplate,
  fillFinishedGamesTemplate,
  fillFinishedGamesByYearTemplate,
  fillWishlistedGamesTemplate,
  fillCatalogTemplate,
  fillUserGamesTemplate,
  fillUserGamesByPlatformTemplate,
  fillUserPlatformsTemplate,
  fillRandomGameTemplate,
} from "../views.js";
import { DEFAULT_FILTER, DEFAULT_SOURCE_ID } from "../enums.js";

export class Router {
  static init() {
    Router.setupCatalogRoute();
    Router.setupGameRoutes();
    Router.setupUserRoutes();
    Router.setupUtilityRoutes();
  }

  static setupCatalogRoute() {
    up.on("link:catalog", (event, _element) => {
      event.transition ||= "move-right";

      up.render("section.main-container", {
        fragment: fillCatalogTemplate(),
        transition: event.transition,
        scroll: "main",
      });
      event.preventDefault();
    });
  }

  static setupGameRoutes() {
    up.on("link:abandoned-games", (event, element) => {
      Router.renderGameListTemplate(event, element, fillAbandonedGamesTemplate);
    });

    up.on("link:currently-playing-games", (event, element) => {
      Router.renderGameListTemplate(
        event,
        element,
        fillCurrentlyPlayingGamesTemplate
      );
    });

    up.on("link:pending-games", (event, element) => {
      Router.renderGameListTemplate(event, element, fillPendingGamesTemplate);
    });

    up.on("link:finished-games", (event, element) => {
      Router.renderGameListTemplate(event, element, fillFinishedGamesTemplate);
    });

    up.on("link:finished-games-by-year", (event, element) => {
      const year = parseInt(element.dataset.id) || new Date().getFullYear();

      up.render("section.main-container", {
        fragment: fillFinishedGamesByYearTemplate(
          year,
          element.dataset.from || DEFAULT_SOURCE_ID,
          parseInt(element.dataset.fromId) || "",
          element.dataset.filter || DEFAULT_FILTER,
          element.dataset.filterValue || "",
          parseInt(element.dataset.page || 0)
        ),
        transition: event.transition || "move-left",
        scroll: "main",
      });
      event.preventDefault();
    });

    up.on("link:wishlisted-games", (event, element) => {
      Router.renderGameListTemplate(
        event,
        element,
        fillWishlistedGamesTemplate
      );
    });

    up.on("link:game-details", (event, element) => {
      up.render("section.main-container", {
        fragment: fillGameDetailsTemplate(
          parseInt(element.dataset?.id) || parseInt(event.gameId),
          element.dataset?.from || event.from || DEFAULT_SOURCE_ID,
          parseInt(element.dataset?.fromId) || parseInt(event.fromId) || ""
        ),
        transition: event.transition || "move-left",
        scroll: "main",
      });

      event.preventDefault();
    });
  }

  static setupUserRoutes() {
    up.on("link:user-games", (event, element) => {
      Router.renderGameListTemplate(event, element, fillUserGamesTemplate);
    });

    up.on("link:user-games-by-platform", (event, element) => {
      up.render("section.main-container", {
        fragment: fillUserGamesByPlatformTemplate(
          parseInt(element.dataset.id),
          element.dataset.from || DEFAULT_SOURCE_ID,
          parseInt(element.dataset.fromId) || "",
          element.dataset.filter || DEFAULT_FILTER,
          element.dataset.filterValue || "",
          parseInt(element.dataset.page || 0)
        ),
        transition: event.transition || "move-left",
        scroll: "main",
      });

      event.preventDefault();
    });

    up.on("link:user-platforms", (event, element) => {
      up.render("section.main-container", {
        fragment: fillUserPlatformsTemplate(
          element.dataset.filter || DEFAULT_FILTER,
          element.dataset.filterValue || ""
        ),
        transition: event.transition || "move-left",
        scroll: "main",
      });
      event.preventDefault();
    });
  }

  static setupUtilityRoutes() {
    up.on("link:random-game", (event) => {
      up.render("section.main-container", {
        fragment: fillRandomGameTemplate(),
        transition: event.transition,
        scroll: "main",
      });
      event.preventDefault();
    });
  }

  static renderGameListTemplate(event, element, templateFunction) {
    up.render("section.main-container", {
      fragment: templateFunction(
        element.dataset.from || DEFAULT_SOURCE_ID,
        parseInt(element.dataset.fromId) || "",
        element.dataset.filter || DEFAULT_FILTER,
        element.dataset.filterValue || "",
        parseInt(element.dataset.page || 0)
      ),
      transition: event.transition || "move-left",
      scroll: "main",
    });
    event.preventDefault();
  }
}
