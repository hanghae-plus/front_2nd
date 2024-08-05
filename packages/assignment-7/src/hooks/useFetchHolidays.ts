import { useState, useEffect } from 'react';

function useFetchHolidays(currentDate: Date) {
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const fetchHolidays = async (year: number, month: number) => {
    try {
      const response = await fetch(`/api/holidays?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch holidays');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching holidays:', error);
      return {};
    }
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchHolidays(year, month).then(setHolidays);
  }, [currentDate]);

  return holidays;
}

export default useFetchHolidays;
