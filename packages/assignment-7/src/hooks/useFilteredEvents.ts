import { searchEvents } from "../services/serachEvents";
import { getWeekDates } from "../utils/getWeekDates";
import { useEvents } from "./useEvents";

interface useFilteredEventsProps {
  searchTerm: string;
  view: "week" | "month";
  currentDate: Date;
}

export const useFilteredEvents = ({
  searchTerm,
  view,
  currentDate,
}: useFilteredEventsProps) => {
  const { events } = useEvents();

  const searchedEvents = searchEvents(events, searchTerm);
  const filteredEvents = searchedEvents.filter((event) => {
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

  return filteredEvents;
};
