export const getLocalStorage = (id) =>
  JSON.parse(localStorage.getItem(id) || 'false');
