export const debounce = (callback: () => void) => {
  let timerId: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      callback();
    }, 500);
  };
};
