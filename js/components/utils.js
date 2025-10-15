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

export function formatGameTime(minutesPlayed) {
  if (!minutesPlayed || minutesPlayed === 0) {
    return "0 mins";
  }
  if (minutesPlayed < 60) {
    return `${minutesPlayed} mins`;
  }
  const hours = minutesPlayed / 60;
  const formattedHours = hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);
  return `${formattedHours} hours`;
}
