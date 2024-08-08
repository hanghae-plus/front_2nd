import { useEffect, useState } from "react";
import { fetchHolidays } from "../mocks/mockFetchHolidays";

export const useView = () => {
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  return { view, setView, currentDate, navigate, holidays };
};
