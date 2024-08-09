import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { Event } from "../type/schedule.type";
import { useEventForm } from "./useEventForm";
import { useTimeValidation } from "./useTimeValidation";
import { useRepeatSettings } from "./useRepeatSettings";
import { useOverlapDetection } from "./useOverlapDetection";
import { useEventSave } from "./useEventSave";
import useCalender from "./useCalender";

export const useEventManagement = () => {
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

  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<
    { id: string; message: string }[]
  >([]);

  const eventForm = useEventForm();
  const timeValidation = useTimeValidation();
  const repeatSettings = useRepeatSettings();
  const overlapDetection = useOverlapDetection(events);
  const eventSave = useEventSave(fetchEvents);
  const {
    notifiedEvents,
    currentDate,
    filteredEvents,
    setNotifiedEvents,
    navigate,
    view,
    setView,
    holidays,
  } = useCalender({ events, searchTerm, setEvents });

  // 반복 이벤트를 처리하는 함수
  const processRepeatEvents = (events: Event[]): Event[] => {
    let processedEvents: Event[] = [];
    events.forEach((event) => {
      if (event.repeat.type === "none") {
        processedEvents.push(event);
      } else {
        const repeatedEvents = generateRepeatedEvents(event);
        processedEvents = [...processedEvents, ...repeatedEvents];
      }
    });
    return processedEvents;
  };

  // 반복 이벤트를 생성하는 함수
  const generateRepeatedEvents = (event: Event): Event[] => {
    const repeatedEvents: Event[] = [];
    const startDate = new Date(event.date);
    const endDate = event.repeat.endDate
      ? new Date(event.repeat.endDate)
      : new Date(
          startDate.getFullYear() + 1,
          startDate.getMonth(),
          startDate.getDate()
        );

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      repeatedEvents.push({
        ...event,
        id: `${event.id}-${currentDate.toISOString()}`,
        date: currentDate.toISOString().split("T")[0],
      });

      switch (event.repeat.type) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + event.repeat.interval);
          break;
        case "weekly":
          currentDate.setDate(
            currentDate.getDate() + 7 * event.repeat.interval
          );
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + event.repeat.interval);
          break;
        case "yearly":
          currentDate.setFullYear(
            currentDate.getFullYear() + event.repeat.interval
          );
          break;
      }
    }

    return repeatedEvents;
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    eventForm.setStartTime(newStartTime);
    timeValidation.validateTime(newStartTime, eventForm.endTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      id: eventForm.editingEvent
        ? `${eventForm.editingEvent.id}`
        : `${Date.now()}`,
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

  const resetRepeat = () => {
    repeatSettings.setIsRepeating(false);
    repeatSettings.setRepeatType("none");
    repeatSettings.setRepeatInterval(1);
    repeatSettings.setRepeatEndDate("");
  };

  const saveEvent = async (eventData: Event) => {
    await eventSave.saveEvent(eventData, !!eventForm.editingEvent);
    eventForm.resetForm();
    resetRepeat();
  };

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

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      await fetchEvents();
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
            id: `${event.id}`,
            message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
          },
        ]);
        setNotifiedEvents((prev) => [...prev, `${event.id}`]);
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    searchTerm,
    setSearchTerm,
    notifications,
    setNotifications,
    eventForm,
    timeValidation,
    repeatSettings,
    overlapDetection,
    notifiedEvents,
    currentDate,
    filteredEvents,
    setNotifiedEvents,
    navigate,
    view,
    setView,
    holidays,
    handleStartTimeChange,
    handleEndTimeChange,
    addOrUpdateEvent,
    saveEvent,
    editEvent,
    deleteEvent,
    checkUpcomingEvents,
  };
};
