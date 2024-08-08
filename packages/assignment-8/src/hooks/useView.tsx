import { useState } from "react";
import { getWeekDates } from "../utils/date";
import { eventsStore } from "../store/eventsStore";
import { searchTermStore } from "../store/searchTermStore";
import { currentDateStore } from "../store/currentDateStore";

export const useView = () => {
  const [view, setView] = useState<"week" | "month">("month");
  const { events } = eventsStore();
  const { searchTerm } = searchTermStore();
  const { currentDate } = currentDateStore();

  // eventSearch, calendar
  const searchEvents = (term: string) => {
    if (!term.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
    );
  };

  // searchTerm에 따라 filter 됨
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

  const handleSetView = (view: "week" | "month") => {
    setView(view);
  };

  return {
    view,
    handleSetView,
    filteredEvents,
  };
};
