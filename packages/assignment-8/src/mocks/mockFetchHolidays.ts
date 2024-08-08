// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchHolidays = (year: number, month: number) => {
  // 실제로는 API를 호출하여 공휴일 정보를 가져와야 합니다.
  // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
  return {
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
};
