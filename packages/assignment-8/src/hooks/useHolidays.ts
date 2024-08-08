import { useEffect, useState } from 'react';
import { fetchHolidays } from '../utils/dateUtils';

export default function useHolidays(currentDate: Date) {
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  return holidays;
}
