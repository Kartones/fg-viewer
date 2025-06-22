"use strict";

export function fillYear(content, year) {
  return content.replaceAll("{{js-year}}", year);
}

export function pluralize(literal, target) {
  let value = 0;
  if ("items" in target) {
    value = Array.isArray(target.items)
      ? target.items.length
      : target.items.size;
  } else {
    value = Array.isArray(target) ? target.length : target.size;
  }
  return `${literal}${value === 1 ? "" : "s"}`;
}
