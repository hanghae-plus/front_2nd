//테스트 지속을 위해 오늘을 변환
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const now = new Date();
export const date = formatDate(now);
const startDate = new Date(now.getTime() + 10 * 60000); // 10분 후
export const startTime = formatTime(startDate);
const endDate = new Date(now.getTime() + 11 * 60000); // 11분 후
export const endTime = formatTime(endDate);
