import { http, HttpResponse } from 'msw';

const holidays = {
  '2024-01-01': '신정',
  '2024-02-09': '설날',
  '2024-02-10': '설날',
  '2024-02-11': '설날',
  '2024-03-01': '삼일절',
  '2024-05-05': '어린이날',
  '2024-06-06': '현충일',
  '2024-08-15': '광복절',
  '2024-09-16': '추석',
  '2024-09-17': '추석',
  '2024-09-18': '추석',
  '2024-10-03': '개천절',
  '2024-10-09': '한글날',
  '2024-12-25': '크리스마스',
};

export const mockHolidayApiHandlers = [
  http.get('/holiday/:year/:month', ({ params }) => {
    const year = params.year as string;
    const month = params.month as string;

    const requestedHolidays = Object.entries(holidays).reduce<{ [key: string]: string }>((acc, [date, name]) => {
      const [holidayYear, holidayMonth] = date.split('-');
      if (holidayYear === year && holidayMonth === month.padStart(2, '0')) {
        acc[date] = name;
      }
      return acc;
    }, {});

    return HttpResponse.json(requestedHolidays);
  }),
];
