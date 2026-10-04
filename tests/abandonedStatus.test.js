import { test, describe, before, after } from "node:test";
import { strict as assert } from "node:assert";
import { fillTableRows } from "../js/components.js";
import { fillGameDetailsTemplate } from "../js/views/gameDetailsView.js";
import { UserGames } from "../js/models/userGames.js";

const PLATFORM_ID = 1;
const SKULL_ICON = 'nes-icon skull "';
const ABANDONED_TITLE = 'title="Abandoned"';

const userGame = (overrides = {}) => ({
  game_id: "id1",
  platform_id: PLATFORM_ID,
  currently_playing: false,
  finished: false,
  year_finished: null,
  year_abandoned: null,
  minutes_played: 0,
  ...overrides,
});

// Old export format: has the abandoned flag and no year_abandoned key at all
const legacyUserGame = () => {
  const { year_abandoned: _omitted, ...legacy } = userGame({ abandoned: true });

  return legacy;
};

const renderListRow = (game, columns = { gameName: true, gameStatusAll: true }) =>
  fillTableRows(
    "{{js-table-rows}}",
    new UserGames([game]).items,
    "source",
    columns
  );

describe("abandoned status in UI", () => {
  let previousAppData;

  before(() => {
    previousAppData = global.appData;
    global.appData = {
      games: { id1: { name: "Game One", platforms: [PLATFORM_ID], urls: {} } },
      platforms: { [PLATFORM_ID]: { name: "Platform", shortname: "PLT" } },
      templates: { "game-details": "{{js-table-rows}}" },
      user: {
        games: new UserGames([]),
        wishlistedGames: new UserGames([]),
      },
    };
  });

  after(() => {
    global.appData = previousAppData;
  });

  describe("game list rows", () => {
    test("abandoned game gets abandoned row class and skull badge", () => {
      const markup = renderListRow(userGame({ year_abandoned: 2022 }));

      assert.match(markup, /class="row-abandoned"/);
      assert.ok(markup.includes(ABANDONED_TITLE));
      assert.ok(markup.includes(SKULL_ICON));
    });

    test("pending game has neither row class nor abandoned badge", () => {
      const markup = renderListRow(userGame());

      assert.doesNotMatch(markup, /row-abandoned/);
      assert.ok(!markup.includes(ABANDONED_TITLE));
      assert.ok(markup.includes('title="Pending"'));
    });

    test("old abandoned flag without year_abandoned is not shown as abandoned", () => {
      const legacyGame = legacyUserGame();
      assert.equal(Object.hasOwn(legacyGame, "year_abandoned"), false);

      const markup = renderListRow(legacyGame);

      assert.doesNotMatch(markup, /row-abandoned/);
      assert.ok(!markup.includes(ABANDONED_TITLE));
    });

    test("finished game keeps finished row class", () => {
      const markup = renderListRow(
        userGame({ finished: true, year_finished: 2021 })
      );

      assert.match(markup, /class="row-finished"/);
    });
  });

  describe("game details", () => {
    const renderDetails = (games) => {
      appData.user.games = new UserGames(games);

      return fillGameDetailsTemplate("id1", "source", null);
    };

    test("abandoned user game shows the skull icon", () => {
      const markup = renderDetails([userGame({ year_abandoned: 2022 })]);

      assert.match(markup, /title="Abandoned"/);
    });

    test("abandoned user game is not listed as pending", () => {
      const markup = renderDetails([userGame({ year_abandoned: 2022 })]);

      assert.doesNotMatch(markup, /title="Pending"/);
    });

    test("pending user game shows pending and no skull icon", () => {
      const markup = renderDetails([userGame()]);

      assert.match(markup, /title="Pending"/);
      assert.doesNotMatch(markup, /title="Abandoned"/);
    });

    test("old abandoned flag without year_abandoned shows pending", () => {
      const legacyGame = legacyUserGame();
      assert.equal(Object.hasOwn(legacyGame, "year_abandoned"), false);

      const markup = renderDetails([legacyGame]);

      assert.match(markup, /title="Pending"/);
      assert.doesNotMatch(markup, /title="Abandoned"/);
    });
  });
});
