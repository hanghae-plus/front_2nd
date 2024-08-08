import { useState } from 'react';

export type View = 'week' | 'month';

export default function useNavigateView(view: View) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  return { currentDate, navigate };
}
