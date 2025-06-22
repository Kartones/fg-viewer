"use strict";

import { DataLoader } from "./data-loader.js";
import { Router } from "./router.js";
import { EventHandlers } from "./event-handlers.js";
import { SearchManager } from "./search-manager.js";
import { FeedbackManager } from "./feedback-manager.js";

export class AppInitializer {
  static init() {
    AppInitializer.setupContentCompiler();
    AppInitializer.initializeModules();
  }

  static setupContentCompiler() {
    up.compiler("#content", () => DataLoader.readData());
  }

  static initializeModules() {
    Router.init();
    EventHandlers.init();
    SearchManager.init();
    FeedbackManager.init();
  }
}
