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

export function formatGameTime(minutesPlayed, detailed = false) {
  if (!minutesPlayed || minutesPlayed === 0) {
    return "0 mins";
  }
  if (minutesPlayed < 60) {
    return `${minutesPlayed} mins`;
  }
  const hours = minutesPlayed / 60;

  if (detailed && hours >= 24) {
    let totalDays = Math.floor(hours / 24);
    const years = Math.floor(totalDays / 365);
    totalDays -= years * 365;
    const months = Math.floor(totalDays / 30);
    totalDays -= months * 30;
    const days = totalDays;

    const parts = [];
    if (years > 0) {
      parts.push(`${years} year${years === 1 ? "" : "s"}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months === 1 ? "" : "s"}`);
    }
    if (days > 0) {
      parts.push(`${days} day${days === 1 ? "" : "s"}`);
    }

    if (parts.length === 1) {
      return parts[0];
    } else if (parts.length === 2) {
      return parts.join(" and ");
    }
    return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  }

  const formattedHours =
    hours % 1 === 0 || detailed ? hours.toFixed(0) : hours.toFixed(1);
  return `${formattedHours} ${hours === 1 ? "hour" : "hours"}`;
}
