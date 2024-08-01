import { http, HttpResponse } from 'msw';
import { initialHolidays } from '../mockData';

export const mockHolidayApiHandlers = [
  http.get('/holiday/:year/:month', ({ params }) => {
    const year = params.year as string;
    const month = params.month as string;

    const requestedHolidays = Object.entries(initialHolidays).reduce<{ [key: string]: string }>((acc, [date, name]) => {
      const [holidayYear, holidayMonth] = date.split('-');
      if (holidayYear === year && holidayMonth === month.padStart(2, '0')) {
        acc[date] = name;
      }
      return acc;
    }, {});

    return HttpResponse.json(requestedHolidays, { status: 201 });
  }),
];
