import { useEffect, useState } from "react";
import { Event } from "../types";
import { useToast } from "@chakra-ui/react";
import dayjs from "dayjs";

export const useEventOperations = (editing: boolean, onSave?: () => void) => {
  const [events, setEvents] = useState<Event[]>([]);
  const toast = useToast();

  const SYSTEM_MAX_DATE = "2030-12-31";

  const generateRepeatedEvents = (event: Event): Event[] => {
    if (event.repeat.type === "none") {
      return [event];
    }

    const repeatedEvents: Event[] = [];

    let currentDate = dayjs(event.date);
    const endDate = event.repeat.endDate ? dayjs(event.repeat.endDate) : dayjs(SYSTEM_MAX_DATE);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      repeatedEvents.push({
        ...event,
        date: currentDate.format("YYYY-MM-DD"),
        id: currentDate.valueOf(),
      });

      switch (event.repeat.type) {
        case "daily":
          currentDate = currentDate.add(event.repeat.interval, "day");
          break;
        case "weekly":
          currentDate = currentDate.add(event.repeat.interval, "week");
          break;
        case "monthly":
          currentDate = currentDate.add(event.repeat.interval, "month");
          break;
        case "yearly":
          currentDate = currentDate.add(event.repeat.interval, "year");
          break;
      }
    }

    return repeatedEvents;
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      const expandedEvents = data.flatMap(generateRepeatedEvents);
      setEvents(expandedEvents);
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

  const saveEvent = async (eventData: Event) => {
    try {
      let response;
      if (editing) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      await fetchEvents();
      onSave?.();
      toast({
        title: editing ? "일정이 수정되었습니다." : "일정이 추가되었습니다.",
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

  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });

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

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, fetchEvents, saveEvent, deleteEvent };
};
