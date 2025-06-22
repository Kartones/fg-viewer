"use strict";

export const cleanSearchBox = () => {
  const searchSelectelement = document.getElementById("gameSearch");
  if (searchSelectelement) {
    const searchBox = NiceSelect.bind(searchSelectelement);
    searchBox.destroy();
  }
};
