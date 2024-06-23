const cache = new Map();

export const memo1 = (fn) => {
  if (cache.has(fn)) {
    return cache.get(fn);
  }
  const result = fn();
  cache.set(fn, result);
  return result;
};

export const memo2 = (fn, dependencies = []) => {
  const key = JSON.stringify({ fn: fn.toString(), dependencies });
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = fn();
  cache.set(key, result);
  return result;
};
