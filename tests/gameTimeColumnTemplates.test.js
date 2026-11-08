import { test, describe, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { readdirSync, readFileSync } from "node:fs";
import { fillDataFields, fillGameTimeColumn } from "../js/components.js";
import { UserPreferences } from "../js/models/userPreferences.js";

const TEMPLATES_DIR = new URL("../templates/", import.meta.url);
const PLACEHOLDER = "{{js-game-time-column}}";
const ALL_FILTERS = {
  platformIdFilter: true,
  platformFilter: true,
  currentlyPlayingFilter: true,
  finishedFilter: true,
  abandonedFilter: true,
  gameTimeFilter: true,
};
const VALUES = { from: "x", fromId: "y", filter: null, filterValue: null };

const listTemplates = () =>
  readdirSync(TEMPLATES_DIR)
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({
      file,
      sourceId: file.replace(".html", "").replaceAll("_", "-"),
      content: readFileSync(new URL(file, TEMPLATES_DIR), "utf8"),
    }))
    .filter(({ content }) => content.includes(PLACEHOLDER));

const render = ({ content, sourceId }) =>
  fillDataFields(fillGameTimeColumn(content, sourceId), ALL_FILTERS, VALUES);

const countHeaders = (markup) => (markup.match(/<th[\s>]/g) || []).length;

let previousAppData;

beforeEach(() => {
  previousAppData = global.appData;
});

afterEach(() => {
  global.appData = previousAppData;
});

const withGameTime = (showGameTime) => {
  global.appData = {
    preferences: new UserPreferences({ show_game_time: showGameTime }),
  };
};

describe("game time column in real list templates", () => {
  test("every list template with a game time header uses the placeholder", () => {
    const withHeader = readdirSync(TEMPLATES_DIR)
      .filter((file) => file.endsWith(".html"))
      .filter((file) =>
        readFileSync(new URL(file, TEMPLATES_DIR), "utf8").includes("gameTime")
      );

    assert.equal(withHeader.length, 0, `raw game time markup in: ${withHeader}`);
    assert.equal(listTemplates().length, 8);
  });

  test("shown: header is present and filled", () => {
    withGameTime(true);

    for (const template of listTemplates()) {
      const output = render(template);

      assert.ok(output.includes('data-filter="gameTime"'), template.file);
      assert.ok(output.includes("Game Time"), template.file);
      assert.ok(!output.includes("{{js-game-time"), template.file);
    }
  });

  test("hidden: one fewer header and no game time markup", () => {
    for (const template of listTemplates()) {
      withGameTime(true);
      const shownHeaders = countHeaders(render(template));

      withGameTime(false);
      const output = render(template);

      assert.equal(countHeaders(output), shownHeaders - 1, template.file);
      assert.ok(!output.includes("gameTime"), template.file);
      assert.ok(!output.includes("Game Time"), template.file);
      assert.ok(!output.includes("{{js-game-time"), template.file);
    }
  });
});
