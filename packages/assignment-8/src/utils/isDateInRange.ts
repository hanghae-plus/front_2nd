const isDateInRange = (date: Date, start: Date, end: Date) => {
  const dateTime = date.getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();

  return dateTime - startTime > 0 && endTime - dateTime > 0;
};

export default isDateInRange;
