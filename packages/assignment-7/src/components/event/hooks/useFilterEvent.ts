import { useState } from "react";
import { Event, ViewType } from "../../../App";
import { getWeekDates, searchEvents } from "../../../utils/date-utils";

/**
 * 현재 날짜와 필터에 따른 이벤트
 * @param events
 * @returns
 */
export const useFilterEvent = (events: Event[]) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<ViewType>("month");

  /**
   * 날짜 이동하는 함수
   * @param direction
   */

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

  /**
   * 일정과 검색에 따라 filter된 이벤트들 목록
   */
  const filteredEvents = (() => {
    const filtered = searchEvents(events, searchTerm);
    return filtered.filter((event) => {
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

  return {
    currentDate,
    filteredEvents,
    searchTerm,
    navigate,
    setSearchTerm,
    view,
    setView,
  };
};
