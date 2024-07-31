import { useState } from 'react';
import { HOLIDAYS_API } from '../constants/api';
import { formatDateString } from '../lib/utils/date';

type Holidays = Record<string, string>;

const fetchHolidays = async (year: number, month: number) => {
  const serviceKey = import.meta.env.HOLIDAYS_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('Service key not found');
  }
  const queryString = new URLSearchParams({
    serviceKey,
    solYear: year.toString(),
    solMonth: month.toString(),
  });
  const response = await fetch(`${HOLIDAYS_API}?${queryString}`);
  if (!response.ok) {
    throw new Error('Failed to fetch holidays');
  }
  // response 형식은 application/xml
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');
  const items = xml.querySelectorAll('item');
  if (items.length === 0) return {};
  const holidays: Holidays = {};

  items.forEach((item) => {
    const locdate = item.querySelector('locdate')?.textContent;
    const dateName = item.querySelector('dateName')?.textContent;

    if (locdate && dateName) {
      holidays[formatDateString(locdate)] = dateName;
    }
  });

  return holidays;
};

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holidays>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
};
