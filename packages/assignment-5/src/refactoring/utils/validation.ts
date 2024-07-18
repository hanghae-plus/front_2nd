export const VALIDATION_CONDITIONS = {
  isNotEmpty: (value: string) => {
    return !!value;
  },
  isPositiveNumber: (value: string) => {
    return !!value && parseInt(value) > 0;
  },
  isRate: (value: string) => {
    return !!value && parseInt(value) >= 0 && parseInt(value) <= 100;
  },
};

export function validation<T>(
  condition: (value: T) => boolean,
  value: T,
  callback: () => void
) {
  if (condition(value)) {
    callback();
  }
}
