import { sortGamesBy } from "../js/components";

global.appData = {};
let items;

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
