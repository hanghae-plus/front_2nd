import { getWeekDates, isDateInRange } from "../utils/date";
import useGetEvents from "./useGetEvents";

const useGetFilteredEvents = (
  term: string,
  currentDate: Date,
  view: "week" | "month"
) => {
  const { events } = useGetEvents();

  const searchEvents = (term: string) => {
    if (!term) return events;
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(term);
    return filtered.filter((event) => {
      const eventDate = new Date(event.date);
      if (view === "week") {
        const weekDates = getWeekDates(currentDate);
        return isDateInRange(eventDate, weekDates[0], weekDates[6]);
      } else if (view === "month") {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
      return true;
    });
  })();

  return { filteredEvents };
};

export default useGetFilteredEvents;
