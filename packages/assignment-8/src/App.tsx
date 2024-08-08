import { useState } from "react";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { Event } from "./types";
import EventForm from "./components/EventForm";
import CalendarView from "./components/CalendarView";
import EventList from "./components/EventList";
import NotificationAlert from "./components/NotificationAlert";

const dummyEvents: Event[] = [];

function App() {
  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [view, setView] = useState<"week" | "month">("month");

  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "이벤트 로딩 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w='full' h='100vh' m='auto' p={5}>
      <Flex gap={6} h='full'>
        <EventForm
          events={events}
          fetchEvents={fetchEvents}
          editingEvent={editingEvent}
          setEditingEvent={setEditingEvent}
        />

        <CalendarView
          events={events}
          searchTerm={searchTerm}
          view={view}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          notifiedEvents={notifiedEvents}
          setView={setView}
        />

        <EventList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          events={events}
          view={view}
          currentDate={currentDate}
          notifiedEvents={notifiedEvents}
          setEditingEvent={setEditingEvent}
          fetchEvents={fetchEvents}
        />
      </Flex>

      <NotificationAlert
        notifiedEvents={notifiedEvents}
        setNotifiedEvents={setNotifiedEvents}
        events={events}
      />
    </Box>
  );
}

export default App;
