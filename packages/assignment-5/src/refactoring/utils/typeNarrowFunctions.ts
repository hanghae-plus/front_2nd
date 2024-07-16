export const isNull = (arg: unknown): arg is null => {
  return arg === null;
};

export const isUndefined = (arg: unknown): arg is undefined => {
  return arg === undefined;
};

export const isZeroLengthArray = (arg: unknown[]): boolean => {
  return arg.length === 0;
};

export const isEmptyString = (arg: string): boolean => {
  return arg === '';
};