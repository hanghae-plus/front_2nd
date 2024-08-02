import { useState } from "react";
import { Box, Flex, useInterval } from "@chakra-ui/react";
import { useGetEvent } from "./components/event/hooks/useGetEvent";
import { useFilterEvent } from "./components/event/hooks/useFilterEvent";
import { useNotification } from "./components/event/notification/hooks/useNotification";
import EventNotification from "./components/event/notification/EventNotification";
import { Event } from "./types/types";
import EventForm from "./components/event/form/EventForm";
import EventCalendar from "./components/event/calendar/EventCalendar";
import EventPanel from "./components/event/panel/EventPanel";
import { useDeleteEvent } from "./components/event/hooks/useDeleteEvent";

function App() {
  const { events, fetchEvents } = useGetEvent();

  const { deleteEvent } = useDeleteEvent(fetchEvents);

  const {
    checkUpcomingEvents,
    notifications,
    notifiedEvents,
    setNotifications,
  } = useNotification(events);

  const {
    currentDate,
    filteredEvents,
    searchTerm,
    setSearchTerm,
    view,
    setView,
    navigate,
  } = useFilterEvent(events);

  // 수정 중 이벤트
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const editEvent = (event: Event) => {
    setEditingEvent(event);
  };

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm
          events={events}
          fetchEvents={fetchEvents}
          editingEvent={editingEvent}
        />

        <EventCalendar
          navigate={navigate}
          view={view}
          setView={setView}
          filteredEvents={filteredEvents}
          currentDate={currentDate}
          notifiedEvents={notifiedEvents}
          checkUpcomingEvents={checkUpcomingEvents}
        />

        <EventPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Flex>

      <EventNotification
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </Box>
  );
}

export default App;
