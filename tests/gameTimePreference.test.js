import { test, describe, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import {
  fillDataFields,
  fillGameTimeColumn,
  fillGameTimeHeader,
  fillTableRows,
  fillTotalGameTime,
} from "../js/components.js";
import { UserPreferences } from "../js/models/userPreferences.js";

const GAME_TIME_COLUMN_PLACEHOLDER = "{{js-game-time-column}}";
const GAME_TIME_CELL_MARKUP = "<td class=\"is-centered\">1.5 hours</td>";
const TOTAL_GAME_TIME_PLACEHOLDER = "{{js-total-game-time}}";
const GAME_ID = "game1";
const SOURCE_ID = "test-source";

const gameRows = (columns) =>
  fillTableRows(
    "{{js-table-rows}}",
    [{ game_id: GAME_ID, minutes_played: 90 }],
    SOURCE_ID,
    columns
  );

let previousAppData;

const withPreferences = (preferences) => {
  global.appData = {
    preferences: new UserPreferences(preferences),
    games: { [GAME_ID]: { name: "Game 1" } },
    user: { games: { items: [{ minutes_played: 90 }] } },
  };
};

beforeEach(() => {
  previousAppData = global.appData;
});

afterEach(() => {
  global.appData = previousAppData;
});

describe("UserPreferences showGameTime", () => {
  test("is true when absent from preferences", () => {
    assert.equal(new UserPreferences({}).showGameTime, true);
  });

  test("is true when set to true", () => {
    assert.equal(new UserPreferences({ show_game_time: true }).showGameTime, true);
  });

  test("is false when set to false", () => {
    assert.equal(
      new UserPreferences({ show_game_time: false }).showGameTime,
      false
    );
  });

  test("does not alter showCatalogHeader", () => {
    const preferences = new UserPreferences({
      show_catalog_header: false,
      show_game_time: true,
    });
    assert.equal(preferences.showCatalogHeader, false);
  });
});

describe("game time hidden", () => {
  beforeEach(() => withPreferences({ show_game_time: false }));

  test("table rows omit the game time cell", () => {
    assert.ok(!gameRows({ gameTime: true }).includes("<td class=\"is-centered\">"));
  });

  test("game time column placeholder is emptied", () => {
    const content = fillDataFields(
      fillGameTimeColumn(`<tr>${GAME_TIME_COLUMN_PLACEHOLDER}</tr>`, "user-games"),
      { gameTimeFilter: true },
      { filter: null, filterValue: null }
    );
    assert.equal(content, "<tr></tr>");
  });

  test("game time header placeholder is emptied", () => {
    assert.equal(fillGameTimeHeader("a{{js-game-time-header}}b"), "ab");
  });

  test("total game time paragraph is removed", () => {
    assert.equal(fillTotalGameTime(TOTAL_GAME_TIME_PLACEHOLDER), "");
  });
});

describe("game time shown", () => {
  beforeEach(() => withPreferences({ show_game_time: true }));

  test("table rows include the game time cell", () => {
    assert.ok(gameRows({ gameTime: true }).includes(GAME_TIME_CELL_MARKUP));
  });

  test("game time column placeholder renders and fills the header", () => {
    const content = fillDataFields(
      fillGameTimeColumn(`<tr>${GAME_TIME_COLUMN_PLACEHOLDER}</tr>`, "user-games"),
      { gameTimeFilter: true },
      { filter: null, filterValue: null }
    );
    assert.ok(content.includes('data-filter="gameTime"'));
    assert.ok(!content.includes("{{js-game-time-filter-value}}"));
  });

  test("game time header placeholder renders the header", () => {
    assert.equal(
      fillGameTimeHeader("{{js-game-time-header}}"),
      "<th>Game Time</th>"
    );
  });

  test("total game time paragraph is rendered", () => {
    assert.equal(
      fillTotalGameTime(TOTAL_GAME_TIME_PLACEHOLDER),
      "<p>Total game time: 2 hours</p>"
    );
  });
});
