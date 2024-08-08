import { Event } from "../App";

export const searchEvents = (events: Event[], term: string) => {
  if (!term.trim()) return events;
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(term.toLowerCase()) ||
      event.description.toLowerCase().includes(term.toLowerCase()) ||
      event.location.toLowerCase().includes(term.toLowerCase())
  );
};
