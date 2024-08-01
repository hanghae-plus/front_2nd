export const categories = ["업무", "개인", "가족", "기타"];

export const weekDaysMonth = ["일", "월", "화", "수", "목", "금", "토"];
export const weekDaysWeek = ["월", "화", "수", "목", "금", "토", "일"];

export const notificationOptions = [
  { value: 1, label: "1분 전" },
  { value: 10, label: "10분 전" },
  { value: 60, label: "1시간 전" },
  { value: 120, label: "2시간 전" },
  { value: 1440, label: "1일 전" },
];

export const mockHolidays = {
  "2024-01-01": "신정",
  "2024-02-09": "설날",
  "2024-02-10": "설날",
  "2024-02-11": "설날",
  "2024-03-01": "삼일절",
  "2024-05-05": "어린이날",
  "2024-06-06": "현충일",
  "2024-08-15": "광복절",
  "2024-09-16": "추석",
  "2024-09-17": "추석",
  "2024-09-18": "추석",
  "2024-10-03": "개천절",
  "2024-10-09": "한글날",
  "2024-12-25": "크리스마스",
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchHolidays = (year: number, month: number) => {
  return mockHolidays;
};
