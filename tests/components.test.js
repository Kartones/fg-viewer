import { paginate, sortGamesBy } from "../js/components";

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

  it("does not errors if trying to page empty list", () => {
    const pagination = paginate([]);
    expect(pagination.items).not.toBeNull();
    expect(pagination.items).toEqual([]);
    expect(pagination.current).toEqual(0);
    expect(pagination.total).toEqual(1);
    expect(pagination.prev).toBeNull();
    expect(pagination.next).toBeNull();
  });

  it("properly calculates page size", () => {
    let pagination = paginate(items, { pageSize: 2 });
    expect(pagination.total).toEqual(3);

    pagination = paginate(items, { pageNumber: 2, pageSize: 2 });
    expect(pagination.total).toEqual(3);
  });

  it("page size falls back to items count if too big", () => {
    const pagination = paginate(items, { pageSize: 100 });
    expect(pagination.total).toEqual(1);
  });

  it("page size defaults to 1 if lower", () => {
    const pagination = paginate(items, { pageSize: -10 });
    expect(pagination.total).toEqual(6);
  });

  it("page number cannot be negative", () => {
    const pagination = paginate(items, { pageNumber: -1 });
    expect(pagination.current).toEqual(0);
  });

  it("page number falls back to max valid page if too big", () => {
    const pagination = paginate(items, { pageNumber: 100, pageSize: 2 });
    expect(pagination.current).toEqual(2);
  });

  it("prev points to correct previous page number", () => {
    let pagination = paginate(items, { pageNumber: 2, pageSize: 2 });
    expect(pagination.prev).toEqual(1);

    pagination = paginate(items, { pageNumber: 1, pageSize: 2 });
    expect(pagination.prev).toEqual(0);

    pagination = paginate(items, { pageNumber: 0, pageSize: 2 });
    expect(pagination.prev).toBeNull();
  });

  it("next points to correct next page number", () => {
    let pagination = paginate(items, { pageNumber: 2, pageSize: 2 });
    expect(pagination.next).toBeNull();

    pagination = paginate(items, { pageNumber: 1, pageSize: 2 });
    expect(pagination.next).toEqual(2);

    pagination = paginate(items, { pageNumber: 0, pageSize: 2 });
    expect(pagination.next).toEqual(1);
  });

  it("items returned are correctly split in pages", () => {
    let pagination;

    pagination = paginate(items, { pageNumber: 0, pageSize: 3 });
    expect(pagination.items).toEqual([
      { game_id: "id1" },
      { game_id: "id2" },
      { game_id: "id3" },
    ]);

    pagination = paginate(items, { pageNumber: 1, pageSize: 3 });
    expect(pagination.items).toEqual([
      { game_id: "id4" },
      { game_id: "id5" },
      { game_id: "id6" },
    ]);

    // out of bounds == last page
    pagination = paginate(items, { pageNumber: 99, pageSize: 3 });
    expect(pagination.items).toEqual([
      { game_id: "id4" },
      { game_id: "id5" },
      { game_id: "id6" },
    ]);

    // odd number of items
    items.push({ game_id: "id7" });

    pagination = paginate(items, { pageNumber: 0, pageSize: 3 });
    expect(pagination.items).toEqual([
      { game_id: "id1" },
      { game_id: "id2" },
      { game_id: "id3" },
    ]);

    pagination = paginate(items, { pageNumber: 1, pageSize: 3 });
    expect(pagination.items).toEqual([
      { game_id: "id4" },
      { game_id: "id5" },
      { game_id: "id6" },
    ]);

    pagination = paginate(items, { pageNumber: 2, pageSize: 3 });
    expect(pagination.items).toEqual([{ game_id: "id7" }]);

    // page size 1
    pagination = paginate(items, { pageNumber: 0, pageSize: 1 });
    expect(pagination.items).toEqual([{ game_id: "id1" }]);
    pagination = paginate(items, { pageNumber: 1, pageSize: 1 });
    expect(pagination.items).toEqual([{ game_id: "id2" }]);
    pagination = paginate(items, { pageNumber: 6, pageSize: 1 });
    expect(pagination.items).toEqual([{ game_id: "id7" }]);
  });

  it("works with a 1-result scenario", () => {
    const pagination = paginate([items[0]]);
    expect(pagination.items).toEqual([{ game_id: "id1" }]);
    expect(pagination.current).toEqual(0);
    expect(pagination.total).toEqual(1);
    expect(pagination.prev).toBeNull();
    expect(pagination.next).toBeNull();
  });
});

describe("sorting", () => {
  beforeAll(() => {
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
    it("sorts ascending in the correct order", () => {
      const sortedItems = sortGamesBy(items, "currentlyPlaying", "ascending");

      // Not only all currently playing first, but in the order they originally appeared (e.g. id2 before id4)
      expect(sortedItems).toEqual([
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

    it("sorts descending in the correct order", () => {
      const sortedItems = sortGamesBy(items, "currentlyPlaying", "descending");

      // Same as ascending, both the corresponding group first (not playing)
      // and maintaining the order (id1 before id3, etc.)
      expect(sortedItems).toEqual([
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
