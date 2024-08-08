import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Event } from "../App";
import { eventApi } from "../apis/event";

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  fetchEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const data = await eventApi.fetch();
    setEvents(data);
  };

  const addEvent = async (event: Event) => {
    await eventApi.create(event);
    await fetchEvents();
  };

  const updateEvent = async (event: Event) => {
    await eventApi.update(event);
    await fetchEvents();
  };

  const deleteEvent = async (id: number) => {
    await eventApi.delete(id.toString());
    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, fetchEvents }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === null) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
