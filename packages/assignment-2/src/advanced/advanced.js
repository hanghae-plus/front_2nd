export const memo1 = (() => {
  let result = null;

  return (fn) => {
    if (result) {
      return result;
    }
    result = fn();
    return result;
  };
})();

export const memo2 = (() => {
  const cache = new Map();

  return (fn, dependencies = []) => {
    const key = [...dependencies].sort().join('-');
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn();
    cache.set(key, result);
    return result;
  };
})();
