import { EventType } from "../types/event";
import { getWeekDates, isDateInRange } from "../utils/date";

type useGetFilteredEventsProps = {
  events: EventType[] | undefined;
  searchTerm: string;
  currentDate: Date;
  view: "week" | "month";
};

const useGetFilteredEvents = ({
  events,
  searchTerm,
  currentDate,
  view,
}: useGetFilteredEventsProps) => {
  const searchEvents = (searchTerm: string) => {
    if (!searchTerm) return events;
    return events?.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(searchTerm);
    return filtered?.filter((event) => {
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
