export const generateRandomId = (now: number) => {
  return now.toString() + Math.random().toString();
};
