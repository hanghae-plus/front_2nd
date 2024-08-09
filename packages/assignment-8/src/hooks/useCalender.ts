import { useEffect, useState } from "react";
import { getWeekDates } from "../dateUtils";
import { Event } from "../type/schedule.type";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchHolidays = (year: number, month: number) => {
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

const useCalender = ({
  events,
  searchTerm,
  setEvents,
}: {
  events: Event[];
  searchTerm: string;
  setEvents: (event: Event[]) => void;
}) => {
  // 일정보기
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const searchEvents = (term: string) => {
    if (!term.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(searchTerm);
    const expandedEvents = filtered.reduce<Event[]>((acc, event) => {
      if (event.repeat.type === "none") {
        return [...acc, event];
      }
      const startDate = new Date(event.date);
      const repeatedEvents: Event[] = [];
      let currentDate = new Date(startDate);

      const endDate =
        view === "week"
          ? new Date(getWeekDates(currentDate)[6])
          : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const dateIncrementFunctions = {
        daily: (date: Date) =>
          date.setDate(date.getDate() + event.repeat.interval),
        weekly: (date: Date) =>
          date.setDate(date.getDate() + 7 * event.repeat.interval),
        monthly: (date: Date) =>
          date.setMonth(date.getMonth() + event.repeat.interval),
        yearly: (date: Date) =>
          date.setFullYear(date.getFullYear() + event.repeat.interval),
      };

      const incrementDate =
        dateIncrementFunctions[
          event.repeat.type as keyof typeof dateIncrementFunctions
        ];

      while (currentDate <= endDate) {
        repeatedEvents.push({
          ...event,
          date: currentDate.toISOString().split("T")[0],
          repeat: { interval: 0, type: "none" },
        });
        incrementDate(currentDate);
      }

      return [...acc, ...repeatedEvents];
    }, []);

    // 날짜 범위에 맞는 이벤트만 필터링
    return expandedEvents.filter((event) => {
      const eventDate = new Date(event.date);

      if (view === "week") {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === "month") {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
      return true;
    });
  })();

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

  const [notifiedEvents, setNotifiedEvents] = useState<string[]>([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  return {
    notifiedEvents,
    currentDate,
    filteredEvents,

    setNotifiedEvents,
    navigate,
    view,
    setView,
    holidays,
  };
};

export default useCalender;
