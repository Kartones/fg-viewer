import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { formatGameTime } from "../js/components/utils.js";

describe("formatGameTime", () => {
  describe("non-detailed (default)", () => {
    test("returns '0 mins' for zero", () => {
      assert.equal(formatGameTime(0), "0 mins");
    });

    test("returns minutes when under 1 hour", () => {
      assert.equal(formatGameTime(45), "45 mins");
    });

    test("returns hours with one decimal for non-whole hours", () => {
      assert.equal(formatGameTime(90), "1.5 hours");
    });

    test("returns whole hours without decimal", () => {
      assert.equal(formatGameTime(120), "2 hours");
    });

    test("uses singular for exactly 1 hour", () => {
      assert.equal(formatGameTime(60), "1 hour");
    });
  });

  describe("detailed mode - under 24 hours", () => {
    test("returns hours only when under 24h", () => {
      assert.equal(formatGameTime(600, true), "10 hours");
    });

    test("uses singular for exactly 1 hour in detailed mode", () => {
      assert.equal(formatGameTime(60, true), "1 hour");
    });
  });

  describe("detailed mode - 24 hours or more (no hours shown)", () => {
    test("returns '1 day' for exactly 24 hours", () => {
      assert.equal(formatGameTime(1440, true), "1 day");
    });

    test("returns days only when no months or years", () => {
      assert.equal(formatGameTime(1500, true), "1 day");
    });

    test("returns multiple days", () => {
      assert.equal(formatGameTime(6000, true), "4 days");
    });

    test("returns months only when days remainder is zero", () => {
      assert.equal(formatGameTime(43200, true), "1 month");
    });

    test("returns year only when no months or days remainder", () => {
      assert.equal(formatGameTime(525600, true), "1 year");
    });

    test("returns 'X months and Y days' format", () => {
      assert.equal(formatGameTime(50400, true), "1 month and 5 days");
    });

    test("returns 'X years, Y months and Z days' format", () => {
      assert.equal(formatGameTime(600000, true), "1 year, 1 month and 21 days");
    });
  });
});
