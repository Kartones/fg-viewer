import { test, describe, beforeEach } from "node:test";
import { strict as assert } from "node:assert";
import { UserGames } from "../js/models/userGames.js";

const userGame = (id, platformId, overrides = {}) => ({
  game_id: id,
  platform_id: platformId,
  currently_playing: false,
  finished: false,
  year_finished: null,
  year_abandoned: null,
  minutes_played: 0,
  ...overrides,
});

// Old export format: has the abandoned flag and no year_abandoned key at all
const legacyUserGame = (id, platformId) => {
  const { year_abandoned: _omitted, ...legacy } = userGame(id, platformId, {
    abandoned: true,
  });

  return legacy;
};

const ids = (games) => games.map((game) => game.game_id);

describe("UserGames normalization", () => {
  const deepFreeze = (value) => {
    Object.values(value).forEach((nested) => {
      if (typeof nested === "object" && nested !== null) {
        deepFreeze(nested);
      }
    });

    return Object.freeze(value);
  };
  const abandonedFlags = (games) => games.items.map((game) => game.abandoned);

  test("items carry abandoned true when year_abandoned is present", () => {
    const games = new UserGames([userGame("a", 1, { year_abandoned: 2022 })]);

    assert.deepEqual(abandonedFlags(games), [true]);
  });

  test("items carry abandoned false when year_abandoned is null or missing", () => {
    const games = new UserGames([userGame("a", 1), legacyUserGame("b", 1)]);

    assert.deepEqual(abandonedFlags(games), [false, false]);
  });

  test("derived flag overrides a conflicting legacy abandoned flag", () => {
    const games = new UserGames([
      userGame("a", 1, { abandoned: false, year_abandoned: 2022 }),
      userGame("b", 1, { abandoned: true, year_abandoned: null }),
    ]);

    assert.deepEqual(abandonedFlags(games), [true, false]);
  });

  test("does not mutate input objects or array", () => {
    const input = deepFreeze([
      userGame("a", 1, { year_abandoned: 2022 }),
      userGame("b", 1, { abandoned: true }),
    ]);
    const snapshot = structuredClone(input);

    const games = new UserGames(input);

    assert.deepEqual(input, snapshot);
    assert.notEqual(games.items, input);
    assert.ok(games.items.every((game, index) => game !== input[index]));
  });

  test("is idempotent", () => {
    const once = new UserGames([
      userGame("a", 1, { year_abandoned: 2022 }),
      userGame("b", 1, { abandoned: true }),
    ]);

    const twice = new UserGames(once.items);

    assert.deepEqual(twice.items, once.items);
  });
});

describe("UserGames", () => {
  const legacyGame = legacyUserGame("legacy", 2);
  let games;

  beforeEach(() => {
    games = new UserGames([
      userGame("fin2023", 1, { finished: true, year_finished: 2023 }),
      userGame("fin2024", 2, { finished: true, year_finished: 2024 }),
      userGame("fin2024b", 1, { finished: true, year_finished: 2024 }),
      userGame("aba2022", 1, { year_abandoned: 2022 }),
      userGame("aba2024", 2, { year_abandoned: 2024 }),
      userGame("pend1", 1),
      userGame("pend2", 2, { currently_playing: true }),
      legacyGame,
    ]);
  });

  describe("finishedByYear", () => {
    test("includes finished and abandoned in that year by default", () => {
      assert.deepEqual(ids(games.finishedByYear(2024)), [
        "fin2024",
        "fin2024b",
        "aba2024",
      ]);
    });

    test("includes only finished when excluding abandoned", () => {
      assert.deepEqual(ids(games.finishedByYear(2024, true)), [
        "fin2024",
        "fin2024b",
      ]);
    });

    test("includes abandoned-only years unless excluded", () => {
      assert.deepEqual(ids(games.finishedByYear(2022)), ["aba2022"]);
      assert.deepEqual(games.finishedByYear(2022, true), []);
    });

    test("returns nothing for a year without games", () => {
      assert.deepEqual(games.finishedByYear(1999), []);
    });
  });

  describe("abandonedByYear", () => {
    test("returns games abandoned in that year", () => {
      assert.deepEqual(ids(games.abandonedByYear(2024)), ["aba2024"]);
      assert.deepEqual(ids(games.abandonedByYear(2022)), ["aba2022"]);
    });

    test("does not return games finished in that year", () => {
      assert.deepEqual(games.abandonedByYear(2023), []);
    });
  });

  describe("withFinishedYear", () => {
    test("returns only games with a finished year", () => {
      assert.deepEqual(ids(games.withFinishedYear()), [
        "fin2023",
        "fin2024",
        "fin2024b",
      ]);
    });
  });

  describe("yearsWithFinishedOrAbandonedGames", () => {
    test("finished years are newest first without duplicates", () => {
      assert.deepEqual(games.yearsWithFinishedOrAbandonedGames("finished"), [
        2024, 2023,
      ]);
    });

    test("abandoned years come from year_abandoned, newest first", () => {
      assert.deepEqual(games.yearsWithFinishedOrAbandonedGames("abandoned"), [
        2024, 2022,
      ]);
    });

    test("removes duplicated abandoned years", () => {
      const duplicated = new UserGames([
        userGame("a", 1, { year_abandoned: 2020 }),
        userGame("b", 1, { year_abandoned: 2020 }),
      ]);
      assert.deepEqual(duplicated.yearsWithFinishedOrAbandonedGames("abandoned"), [
        2020,
      ]);
    });

    test("throws on invalid kind", () => {
      assert.throws(
        () => games.yearsWithFinishedOrAbandonedGames("pending"),
        /Invalid kind parameter/
      );
    });
  });

  describe("status lists", () => {
    test("pending excludes finished and abandoned", () => {
      assert.deepEqual(ids(games.pending()), ["pend1", "pend2", "legacy"]);
    });

    test("abandoned returns only games with year_abandoned", () => {
      assert.deepEqual(ids(games.abandoned()), ["aba2022", "aba2024"]);
    });

    test("finished uses the finished flag", () => {
      assert.deepEqual(ids(games.finished()), [
        "fin2023",
        "fin2024",
        "fin2024b",
      ]);
    });

    test("old abandoned flag without year_abandoned is not abandoned", () => {
      assert.equal(Object.hasOwn(legacyGame, "year_abandoned"), false);
      assert.ok(!games.abandoned().some((game) => game.game_id === "legacy"));
      assert.ok(games.pending().some((game) => game.game_id === "legacy"));
    });
  });

  describe("platform methods", () => {
    test("abandonedByPlatform", () => {
      assert.deepEqual(ids(games.abandonedByPlatform(1)), ["aba2022"]);
      assert.deepEqual(ids(games.abandonedByPlatform(2)), ["aba2024"]);
    });

    test("pendingByPlatform", () => {
      assert.deepEqual(ids(games.pendingByPlatform(1)), ["pend1"]);
      assert.deepEqual(ids(games.pendingByPlatform(2)), ["pend2", "legacy"]);
    });
  });

  describe("completed percentages", () => {
    test("platform catalog percent counts finished and abandoned as completed", () => {
      // platform 1: fin2023, fin2024b, aba2022, pend1 -> 3 of 4
      assert.equal(games.completedPlatformCatalogPercent(1), 75);
      // platform 2: fin2024, aba2024, pend2, legacy -> 2 of 4
      assert.equal(games.completedPlatformCatalogPercent(2), 50);
    });

    test("platform catalog percent is 0 without games", () => {
      assert.equal(games.completedPlatformCatalogPercent(99), 0);
    });

    test("catalog percent counts finished and abandoned as completed", () => {
      // 5 of 8 completed
      assert.equal(games.completedCatalogPercent(), 62);
    });
  });
});
