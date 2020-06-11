export const timeConverter = (time) => new Date(time).getTime();

export const timeInDays = (endDate, startDate) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const start = timeConverter(startDate);
  const end = timeConverter(endDate);
  return ((end - start) / oneDay);
};
