"use strict";

export function renderMarkup(templateId, transformations) {
  return transformations.reduce(
    (content, fn) => fn(content),
    appData.templates[templateId]
  );
}
