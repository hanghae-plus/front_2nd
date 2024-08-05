const HOLIDAY_RECORD = {
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
  "2024-12-25": "크리스마스"
};

type HolidayRecord = typeof HOLIDAY_RECORD;
type HolidayKeys = keyof HolidayRecord;

export function fetchHolidays(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const holidays = Object.keys(HOLIDAY_RECORD) as HolidayKeys[];
  return holidays
    .filter((date) => date.includes(`${y}-${m}`))
    .reduce((acc: Partial<HolidayRecord>, date) => ({
      ...acc,
      [date]: HOLIDAY_RECORD[date],
    }), {});
}
