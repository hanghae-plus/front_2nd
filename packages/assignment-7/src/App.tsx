import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  useInterval,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Event } from "./type/schedule.type";

import useForm from "./hooks/useForm";
import useCalender from "./hooks/useCalender";
import CalenderMonth from "./components/calender/CalenderMonth";
import CalenderWeek from "./components/calender/CalenderWeek";
import EventForm from "./components/form/EventForm";
import EventAlert from "./components/alert/EventAlert";
import EventNotification from "./components/notification/EventNotification";
import EventList from "./components/list/EventList";

const dummyEvents: Event[] = [];

function App() {
  const toast = useToast();

  //이벤트
  const [events, setEvents] = useState<Event[]>(dummyEvents);

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

  const {
    editingEvent,
    title,
    setTitle,
    date,
    setDate,
    startTimeError,
    startTime,
    handleStartTimeChange,
    validateTime,
    endTime,
    endTimeError,
    handleEndTimeChange,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    addOrUpdateEvent,
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappingEvents,
    saveEvent,
    notificationTime,
    setIsRepeating,
    setNotificationTime,
    setEditingEvent,
    setStartTime,
    setEndTime,
  } = useForm({ fetchEvents, events });

  // 일정 검색
  const [searchTerm, setSearchTerm] = useState("");

  const {
    notifiedEvents,
    currentDate,
    filteredEvents,
    setNotifiedEvents,
    navigate,
    view,
    setView,
    holidays,
  } = useCalender({ events, searchTerm });

  // 상단 notification
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setLocation(event.location);
    setCategory(event.category);
    setIsRepeating(event.repeat.type !== "none");
    setRepeatType(event.repeat.type);
    setRepeatInterval(event.repeat.interval);
    setRepeatEndDate(event.repeat.endDate || "");
    setNotificationTime(event.notificationTime);
  };

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

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      {/* 일정  */}
      <Flex gap={6} h="full">
        <EventForm
          form={{
            title: title,
            setTitle: setTitle,
            date: date,
            setDate: setDate,
            startTime: startTime,
            setStartTime: setStartTime,
            endTime: endTime,
            setEndTime: setEndTime,
            description: description,
            setDescription: setDescription,
            location: location,
            setLocation: setLocation,
            category: category,
            setCategory: setCategory,
            isRepeating: isRepeating,
            setIsRepeating: setIsRepeating,
            repeatType: repeatType,
            setRepeatType: setRepeatType,
            repeatInterval: repeatInterval,
            setRepeatInterval: setRepeatInterval,
            repeatEndDate: repeatEndDate,
            setRepeatEndDate: setRepeatEndDate,
          }}
          editingEvent={editingEvent}
          startTimeError={startTimeError}
          handleStartTimeChange={handleStartTimeChange}
          validateTime={validateTime}
          endTimeError={endTimeError}
          handleEndTimeChange={handleEndTimeChange}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          addOrUpdateEvent={addOrUpdateEvent}
        />

        {/* 달력 */}
        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              data-testid="calender-prev-button"
              onClick={() => navigate("prev")}
            />
            <Select
              aria-label="view"
              data-testid="calender-type-select"
              value={view}
              onChange={(e) => setView(e.target.value as "week" | "month")}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              data-testid="calender-next-button"
              icon={<ChevronRightIcon />}
              onClick={() => navigate("next")}
            />
          </HStack>

          {view === "week" && (
            <CalenderWeek
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
            />
          )}
          {view === "month" && (
            <CalenderMonth
              currentDate={currentDate}
              holidays={holidays}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
            />
          )}
        </VStack>

        {/* 일정 리스트 */}
        <EventList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Flex>

      <EventAlert
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        saveEvent={saveEvent}
        editingEvent={editingEvent}
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        description={description}
        location={location}
        category={category}
        isRepeating={isRepeating}
        repeatType={repeatType}
        repeatInterval={repeatInterval}
        repeatEndDate={repeatEndDate}
        notificationTime={notificationTime}
      />

      {notifications.length > 0 && (
        <EventNotification
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}
    </Box>
  );
}

export default App;
