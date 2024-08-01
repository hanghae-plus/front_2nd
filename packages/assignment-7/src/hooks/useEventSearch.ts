import { Event, ViewType } from "@/types";
import getWeekDates from "@/utils/getWeekDates";
import { useState } from "react";

interface Props {
  events: Array<Event>;
  view: ViewType;
  currentDate: Date;
}
const useEventSearch = ({ events, view, currentDate }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  /**
   * 일정 검색하기
   */
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
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};

export default useEventSearch;
