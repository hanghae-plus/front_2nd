import { InputEventHandler } from "@/types";

export const debounce = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any[]) => void,
  duration: number
) => {
  let timer: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, duration);
  };
};

export const eventDebounce = (
  callback: InputEventHandler,
  duration: number
) => {
  let timer: number;
  return ((event) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(event);
    }, duration);
  }) as InputEventHandler;
};
