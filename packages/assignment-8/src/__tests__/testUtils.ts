export const getAlarmBoundary = (now = new Date()) => {
  const startTime = new Date(now.getTime() + 5 * 60000); // 5분 후
  const endTime = new Date(startTime.getTime() + 60 * 60000); // 시작시간으로부터 1시간 후

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  return {
    date: formatDate(now),
    startTime: formatTime(startTime),
    endTime: formatTime(endTime),
  };
};
