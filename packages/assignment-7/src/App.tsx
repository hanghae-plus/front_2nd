import { useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { useGetEvent } from "./components/event/hooks/useGetEvent";
import { useDeleteEvent } from "./components/event/hooks/useDeleteEvent";
import EventForm from "./components/form/EventForm";
import EventCalendar from "./components/calendar/EventCalendar";
import { useFilterEvent } from "./components/event/hooks/useFilterEvent";
import EventPanel from "./components/panel/EventPanel";
import { useNotification } from "./components/notification/hooks/useNotification";

export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number;
}

export type ViewType = "week" | "month";

function App() {
  const { events, fetchEvents } = useGetEvent();

  // 이벤트 삭제
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

      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
            <Alert
              key={notification.id}
              status="info"
              variant="solid"
              width="auto"
            >
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
              </Box>
              <CloseButton
                onClick={() =>
                  setNotifications((prev) => prev.filter((_, i) => i !== index))
                }
              />
            </Alert>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default App;
