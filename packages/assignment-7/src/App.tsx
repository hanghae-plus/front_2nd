import { ChangeEvent, useEffect, useState } from "react";
import { Box, Flex, useInterval, useToast } from "@chakra-ui/react";
import { Event } from "./type/schedule.type";

import useCalender from "./hooks/useCalender";
import EventForm from "./components/form/EventForm";
import EventAlert from "./components/alert/EventAlert";
import EventNotification from "./components/notification/EventNotification";
import EventList from "./components/list/EventList";
import { useEventForm } from "./hooks/useEventForm";
import { useTimeValidation } from "./hooks/useTimeValidation";
import { useRepeatSettings } from "./hooks/useRepeatSettings";
import { useOverlapDetection } from "./hooks/useOverlapDetection";
import { useEventSave } from "./hooks/useEventSave";
import EventCalender from "./components/calender/EventCalender";

const dummyEvents: Event[] = [];

function App() {
  const toast = useToast();

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

  const eventForm = useEventForm();
  const timeValidation = useTimeValidation();
  const repeatSettings = useRepeatSettings();
  const overlapDetection = useOverlapDetection(events);
  const eventSave = useEventSave(fetchEvents);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    eventForm.setStartTime(newStartTime);
    timeValidation.validateTime(newStartTime, eventForm.endTime);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    eventForm.setEndTime(newEndTime);
    timeValidation.validateTime(eventForm.startTime, newEndTime);
  };

  const addOrUpdateEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.date ||
      !eventForm.startTime ||
      !eventForm.endTime
    ) {
      toast({
        title: "필수 정보를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    timeValidation.validateTime(eventForm.startTime, eventForm.endTime);
    if (timeValidation.startTimeError || timeValidation.endTimeError) {
      toast({
        title: "시간 설정을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event = {
      id: eventForm.editingEvent ? eventForm.editingEvent.id : Date.now(),
      ...eventForm,
      repeat: {
        type: repeatSettings.isRepeating ? repeatSettings.repeatType : "none",
        interval: repeatSettings.repeatInterval,
        endDate: repeatSettings.repeatEndDate || undefined,
      },
    };

    const overlapping = overlapDetection.findOverlappingEvents(eventData);
    if (overlapping.length > 0) {
      overlapDetection.setOverlappingEvents(overlapping);
      overlapDetection.setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
    }
  };

  const saveEvent = async (eventData: Event) => {
    await eventSave.saveEvent(eventData, !!eventForm.editingEvent);
    eventForm.resetForm();
    repeatSettings.setIsRepeating(false);
    repeatSettings.setRepeatType("none");
    repeatSettings.setRepeatInterval(1);
    repeatSettings.setRepeatEndDate("");
  };

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
    eventForm.setEditingEvent(event);
    eventForm.setTitle(event.title);
    eventForm.setDate(event.date);
    eventForm.setStartTime(event.startTime);
    eventForm.setEndTime(event.endTime);
    eventForm.setDescription(event.description);
    eventForm.setLocation(event.location);
    eventForm.setCategory(event.category);
    repeatSettings.setIsRepeating(event.repeat.type !== "none");
    repeatSettings.setRepeatType(event.repeat.type);
    repeatSettings.setRepeatInterval(event.repeat.interval);
    repeatSettings.setRepeatEndDate(event.repeat.endDate || "");
    eventForm.setNotificationTime(event.notificationTime);
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

  useInterval(checkUpcomingEvents, 1000);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm
          form={{
            title: eventForm.title,
            setTitle: eventForm.setTitle,
            date: eventForm.date,
            setDate: eventForm.setDate,
            startTime: eventForm.startTime,
            setStartTime: eventForm.setStartTime,
            endTime: eventForm.endTime,
            setEndTime: eventForm.setEndTime,
            description: eventForm.description,
            setDescription: eventForm.setDescription,
            location: eventForm.location,
            setLocation: eventForm.setLocation,
            category: eventForm.category,
            setCategory: eventForm.setCategory,
            isRepeating: repeatSettings.isRepeating,
            setIsRepeating: repeatSettings.setIsRepeating,
            repeatType: repeatSettings.repeatType,
            setRepeatType: repeatSettings.setRepeatType,
            repeatInterval: repeatSettings.repeatInterval,
            setRepeatInterval: repeatSettings.setRepeatInterval,
            repeatEndDate: repeatSettings.repeatEndDate,
            setRepeatEndDate: repeatSettings.setRepeatEndDate,
          }}
          editingEvent={eventForm.editingEvent}
          startTimeError={timeValidation.startTimeError}
          handleStartTimeChange={handleStartTimeChange}
          validateTime={timeValidation.validateTime}
          endTimeError={timeValidation.endTimeError}
          handleEndTimeChange={handleEndTimeChange}
          notificationTime={eventForm.notificationTime}
          setNotificationTime={eventForm.setNotificationTime}
          addOrUpdateEvent={addOrUpdateEvent}
        />
        <EventCalender
          view={view}
          setView={setView}
          navigate={navigate}
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
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

      <EventAlert
        isOverlapDialogOpen={overlapDetection.isOverlapDialogOpen}
        setIsOverlapDialogOpen={overlapDetection.setIsOverlapDialogOpen}
        overlappingEvents={overlapDetection.overlappingEvents}
        saveEvent={saveEvent}
        editingEvent={eventForm.editingEvent}
        title={eventForm.title}
        date={eventForm.date}
        startTime={eventForm.startTime}
        endTime={eventForm.endTime}
        description={eventForm.description}
        location={eventForm.location}
        category={eventForm.category}
        notificationTime={eventForm.notificationTime}
        isRepeating={repeatSettings.isRepeating}
        repeatType={repeatSettings.repeatType}
        repeatInterval={repeatSettings.repeatInterval}
        repeatEndDate={repeatSettings.repeatEndDate}
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
