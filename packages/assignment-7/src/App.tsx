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
import { getWeekDates, searchEvents } from "./utils/date-utils";
import { useGetEvent } from "./components/event/hooks/useGetEvent";
import { useDeleteEvent } from "./components/event/hooks/useDeleteEvent";
import EventForm from "./components/event/EventForm";
import EventCalendar from "./components/calendar/EventCalendar";
import EventList from "./components/event/EventList";

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
  notificationTime: number; // 분 단위로 저장
}

export type ViewType = "week" | "month";

function App() {
  const { events, fetchEvents } = useGetEvent();

  const [view, setView] = useState<ViewType>("month");
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState("");

  // 수정 중 이벤트
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const editEvent = (event: Event) => {
    setEditingEvent(event);
  };

  // 이벤트 삭제
  const { deleteEvent } = useDeleteEvent(fetchEvents);

  // 다가오는 이벤트
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

  // 날짜 이동
  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  /**
   * 일정과 검색에 따라 filter된 이벤트들 목록
   */
  const filteredEvents = (() => {
    const filtered = searchEvents(events, searchTerm);
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

        <EventList
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
            <Alert key={index} status="info" variant="solid" width="auto">
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
