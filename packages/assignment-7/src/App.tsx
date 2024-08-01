import { Box, Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import NotificationAlert from "./components/NotificationAlert";
import OverlappingAlert from "./components/OverlappingAlert";
import useCalendarView from "./hooks/useCalendarView";
import useEventForm from "./hooks/useEventForm";
import useEventNotifications from "./hooks/useEventNotifications";
import useOverlappingEvents from "./hooks/useOverlappingEvents";
import { Event } from "./types";
import getWeekDates from "./utils/getWeekDates";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast();

  const eventForm = useEventForm({ setEditingEvent });
  const calendarView = useCalendarView();
  const eventNotifications = useEventNotifications({ events });
  const overlappingEvents = useOverlappingEvents({ events });

  const { resetForm, editEvent, eventFormData, validateSubmitEventForm } =
    eventForm;
  const { view, currentDate } = calendarView;
  const { notifications, setNotifications, notifiedEvents } =
    eventNotifications;
  const {
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappedEvents,
    getIsOverlappingAndSetOverlappingEvents,
  } = overlappingEvents;

  /**
   * 서버에서 일정 정보 가져오기
   */
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

  /**
   * 일정 추가 혹은 수정
   */
  const addOrUpdateEvent = async () => {
    const canSubmit = validateSubmitEventForm();

    if (!canSubmit) {
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      ...eventFormData,
    };

    const isOverlapping = getIsOverlappingAndSetOverlappingEvents(eventData);

    if (isOverlapping) {
      return;
    }

    await saveEvent(eventData);
  };

  /**
   * 일정 생성 및 수정 기능 중 저장하기 눌렀을 때
   */
  const saveEvent = async (eventData: Event) => {
    try {
      let response;
      if (editingEvent) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      setEditingEvent(null);
      resetForm();
      toast({
        title: editingEvent
          ? "일정이 수정되었습니다."
          : "일정이 추가되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "일정 저장 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * 일정 삭제 눌렀을 때
   */
  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      toast({
        title: "일정이 삭제되었습니다.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "일정 삭제 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * 일정 검색하기
   */
  const searchEvents = (term: string) => {
    if (!term.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(searchTerm);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const onClickGoing = () => {
    setIsOverlapDialogOpen(false);
    saveEvent({
      id: editingEvent ? editingEvent.id : Date.now(),
      ...eventFormData,
    });
  };

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm
          editingEvent={editingEvent}
          addOrUpdateEvent={addOrUpdateEvent}
          eventForm={eventForm}
        />
        <CalendarView
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          calendarView={calendarView}
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

      <OverlappingAlert
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappedEvents={overlappedEvents}
        onClickGoing={onClickGoing}
      />
      <NotificationAlert
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </Box>
  );
}

export default App;
