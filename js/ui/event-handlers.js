"use strict";

import { cleanSearchBox } from "./utils.js";

export class EventHandlers {
  static init() {
    EventHandlers.setupClickHandler();
  }

  static setupClickHandler() {
    up.on("up:click", function (event) {
      if (EventHandlers.shouldCleanSearchBox(event.target)) {
        cleanSearchBox();
      }
    });
  }

  static shouldCleanSearchBox(target) {
    const allowedTags = ["DIV", "LI", "SPAN"];
    const searchClasses = ["select", "nice-select", "option", "current"];

    if (!allowedTags.includes(target.tagName)) {
      return true;
    }

    return !searchClasses.some((cls) => target.classList.contains(cls));
  }
}
