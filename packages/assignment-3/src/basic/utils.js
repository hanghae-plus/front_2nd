export function isUndefined(target) {
  return target === undefined;
}

export function isNull(target) {
  return target === null;
}

export function isNill(target) {
  return isUndefined(target) || isNull(target);
}
