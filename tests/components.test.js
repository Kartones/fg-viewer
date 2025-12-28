import { test, describe, beforeEach, before } from "node:test";
import { strict as assert } from "node:assert";
import { paginate, sortGamesBy } from "../js/components.js";

global.appData = {};
let items;

describe("paging", () => {
  beforeEach(() => {
    items = [
      {
        game_id: "id1",
      },
      {
        game_id: "id2",
      },
      {
        game_id: "id3",
      },
      {
        game_id: "id4",
      },
      {
        game_id: "id5",
      },
      {
        game_id: "id6",
      },
    ];
  });

  test("does not errors if trying to page empty list", () => {
    const pagination = paginate([]);
    assert.notEqual(pagination.items, null);
    assert.deepEqual(pagination.items, []);
    assert.equal(pagination.current, 0);
    assert.equal(pagination.total, 1);
    assert.equal(pagination.prev, null);
    assert.equal(pagination.next, null);
  });

  test("properly calculates page size", () => {
    let pagination = paginate(items, { pageSize: 2 });
    assert.equal(pagination.total, 3);

    pagination = paginate(items, { pageNumber: 2, pageSize: 2 });
    assert.equal(pagination.total, 3);
  });

  test("page size falls back to items count if too big", () => {
    const pagination = paginate(items, { pageSize: 200 });
    assert.equal(pagination.total, 1);
  });

  test("page size defaults to 1 if lower", () => {
    const pagination = paginate(items, { pageSize: -10 });
    assert.equal(pagination.total, 6);
  });

  test("page number cannot be negative", () => {
    const pagination = paginate(items, { pageNumber: -1 });
    assert.equal(pagination.current, 0);
  });

  test("page number falls back to max valid page if too big", () => {
    const pagination = paginate(items, { pageNumber: 100, pageSize: 2 });
    assert.equal(pagination.current, 2);
  });

  test("prev points to correct previous page number", () => {
    let pagination = paginate(items, { pageNumber: 2, pageSize: 2 });
    assert.equal(pagination.prev, 1);

    pagination = paginate(items, { pageNumber: 1, pageSize: 2 });
    assert.equal(pagination.prev, 0);

    pagination = paginate(items, { pageNumber: 0, pageSize: 2 });
    assert.equal(pagination.prev, null);
  });

  test("next points to correct next page number", () => {
    let pagination = paginate(items, { pageNumber: 2, pageSize: 2 });
    assert.equal(pagination.next, null);

    pagination = paginate(items, { pageNumber: 1, pageSize: 2 });
    assert.equal(pagination.next, 2);

    pagination = paginate(items, { pageNumber: 0, pageSize: 2 });
    assert.equal(pagination.next, 1);
  });

  test("items returned are correctly split in pages", () => {
    let pagination;

    pagination = paginate(items, { pageNumber: 0, pageSize: 3 });
    assert.deepEqual(pagination.items, [
      { game_id: "id1" },
      { game_id: "id2" },
      { game_id: "id3" },
    ]);

    pagination = paginate(items, { pageNumber: 1, pageSize: 3 });
    assert.deepEqual(pagination.items, [
      { game_id: "id4" },
      { game_id: "id5" },
      { game_id: "id6" },
    ]);

    // out of bounds == last page
    pagination = paginate(items, { pageNumber: 99, pageSize: 3 });
    assert.deepEqual(pagination.items, [
      { game_id: "id4" },
      { game_id: "id5" },
      { game_id: "id6" },
    ]);

    // odd number of items
    items.push({ game_id: "id7" });

    pagination = paginate(items, { pageNumber: 0, pageSize: 3 });
    assert.deepEqual(pagination.items, [
      { game_id: "id1" },
      { game_id: "id2" },
      { game_id: "id3" },
    ]);

    pagination = paginate(items, { pageNumber: 1, pageSize: 3 });
    assert.deepEqual(pagination.items, [
      { game_id: "id4" },
      { game_id: "id5" },
      { game_id: "id6" },
    ]);

    pagination = paginate(items, { pageNumber: 2, pageSize: 3 });
    assert.deepEqual(pagination.items, [{ game_id: "id7" }]);

    // page size 1
    pagination = paginate(items, { pageNumber: 0, pageSize: 1 });
    assert.deepEqual(pagination.items, [{ game_id: "id1" }]);
    pagination = paginate(items, { pageNumber: 1, pageSize: 1 });
    assert.deepEqual(pagination.items, [{ game_id: "id2" }]);
    pagination = paginate(items, { pageNumber: 6, pageSize: 1 });
    assert.deepEqual(pagination.items, [{ game_id: "id7" }]);
  });

  test("works with a 1-result scenario", () => {
    const pagination = paginate([items[0]]);
    assert.deepEqual(pagination.items, [{ game_id: "id1" }]);
    assert.equal(pagination.current, 0);
    assert.equal(pagination.total, 1);
    assert.equal(pagination.prev, null);
    assert.equal(pagination.next, null);
  });
});

describe("sorting", () => {
  before(() => {
    appData = {
      // Fill with relevant info like the name
      games: {
        id1: {},
        id2: {},
        id3: {},
        id4: {},
      },
    };
  });

  beforeEach(() => {
    items = [
      {
        game_id: "id1",
        currently_playing: false,
      },
      {
        game_id: "id2",
        currently_playing: true,
      },
      {
        game_id: "id3",
        currently_playing: false,
      },
      {
        game_id: "id4",
        currently_playing: true,
      },
    ];
  });

  describe("currentlyPlaying", () => {
    test("sorts ascending in the correct order", () => {
      const sortedItems = sortGamesBy(items, "currentlyPlaying", "ascending");

      // Not only all currently playing first, but in the order they originally appeared (e.g. id2 before id4)
      assert.deepEqual(sortedItems, [
        {
          game_id: "id2",
          currently_playing: true,
        },
        {
          game_id: "id4",
          currently_playing: true,
        },
        {
          game_id: "id1",
          currently_playing: false,
        },
        {
          game_id: "id3",
          currently_playing: false,
        },
      ]);
    });

    test("sorts descending in the correct order", () => {
      const sortedItems = sortGamesBy(items, "currentlyPlaying", "descending");

      // Same as ascending, both the corresponding group first (not playing)
      // and maintaining the order (id1 before id3, etc.)
      assert.deepEqual(sortedItems, [
        {
          game_id: "id1",
          currently_playing: false,
        },
        {
          game_id: "id3",
          currently_playing: false,
        },
        {
          game_id: "id2",
          currently_playing: true,
        },
        {
          game_id: "id4",
          currently_playing: true,
        },
      ]);
    });
  });
});
