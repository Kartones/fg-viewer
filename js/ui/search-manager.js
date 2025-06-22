"use strict";

import { cleanSearchBox } from "./utils.js";

export class SearchManager {
  static init() {
    SearchManager.setupFragmentHandlers();
  }

  static setupFragmentHandlers() {
    up.on("up:fragment:inserted", SearchManager.handleFragmentInserted);
    up.on("up:fragment:destroyed", SearchManager.handleFragmentDestroyed);
  }

  static handleFragmentInserted(_event, fragment) {
    if (SearchManager.hasGameSearch(fragment)) {
      SearchManager.initializeGameSearch();
    }
  }

  static handleFragmentDestroyed(_event, fragment) {
    if (SearchManager.hasGameSearch(fragment)) {
      cleanSearchBox();
    }
  }

  static hasGameSearch(fragment) {
    return fragment.innerHTML.includes('select id="gameSearch"');
  }

  static initializeGameSearch() {
    const searchSelectElement = document.getElementById("gameSearch");
    if (!searchSelectElement) return;

    const searchBox = NiceSelect.bind(searchSelectElement, {
      searchable: true,
      placeholder: "Type to search",
      searchtext: "Type to search",
    });
    searchBox.update();

    SearchManager.setupSearchChangeHandler(searchSelectElement);
  }

  static setupSearchChangeHandler(searchSelectElement) {
    searchSelectElement.addEventListener("change", (event) => {
      const value = parseInt(event.target.value, 10);
      if (value !== -1) {
        cleanSearchBox();
        up.emit("link:game-details", {
          gameId: value,
          from: searchSelectElement.dataset["from"],
          fromId: searchSelectElement.dataset["fromId"],
        });
      }
    });
  }
}
