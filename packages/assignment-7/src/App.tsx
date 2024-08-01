import { useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useGetEvent } from "./components/event/hooks/useGetEvent";
import { useDeleteEvent } from "./components/event/hooks/useDeleteEvent";
import EventForm from "./components/event/EventForm";
import EventCalendar from "./components/calendar/EventCalendar";
import EventList from "./components/event/EventList";
import { useFilterEvent } from "./components/event/hooks/useFilterEvent";

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

  // 수정 중 이벤트
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const editEvent = (event: Event) => {
    setEditingEvent(event);
  };

  // 이벤트 삭제
  const { deleteEvent } = useDeleteEvent(fetchEvents);

  // 다가오는 이벤트
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);
  const checkUpcomingEvents = async () => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime &&
        !notifiedEvents.includes(event.id)
      );
    });

    for (const event of upcomingEvents) {
      try {
        setNotifications((prev) => [
          ...prev,
          {
            id: event.id,
            message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
          },
        ]);
        setNotifiedEvents((prev) => [...prev, event.id]);
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }
  };

  const {
    currentDate,
    filteredEvents,
    searchTerm,
    setSearchTerm,
    view,
    setView,
    navigate,
  } = useFilterEvent(events);

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

        <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
          <FormControl>
            <FormLabel>일정 검색</FormLabel>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>
          <EventList
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        </VStack>
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
