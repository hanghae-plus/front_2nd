import { useState } from "react";
import { Event } from "../types/type";
import { useToast } from "@chakra-ui/react";
import { isOverlapping } from "../testFn/eventFn";

interface Props {
  editingEvent: Event | null;
  setEditingEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}

export const useEvent = ({ editingEvent, setEditingEvent }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

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

  const addOrUpdateEvent = async (newEvent: Event) => {
    if (
      !newEvent.title ||
      !newEvent.date ||
      !newEvent.startTime ||
      !newEvent.endTime
    ) {
      toast({
        title: "필수 정보를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const isTimeError = validateTime(newEvent.startTime, newEvent.endTime);
    if (isTimeError) {
      toast({
        title: "시간 설정을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const overlapping = findOverlappingEvents(events, newEvent);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(newEvent);
    }
  };

  // const updateEvent = useCallback(async (eventData: Event) => {
  //   try {
  //     await axios.put(`/api/events/${eventData.id}`, eventData);
  //     setEvents((prevEvents) =>
  //       prevEvents.map((event) =>
  //         event.id === eventData.id ? eventData : event,
  //       ),
  //     );
  //     toast({
  //       title: "일정이 수정되었습니다.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "일정 저장 실패",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // }, []);

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
  // const deleteEvent = useCallback(async (id: number) => {
  //   try {
  //     await axios.delete(`/api/events/${id}`);
  //     setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  //     toast({
  //       title: "일정이 삭제되었습니다.",
  //       status: "info",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "일정 삭제 실패",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // }, []);

  return {
    events,
    fetchEvents,
    addOrUpdateEvent,
    saveEvent,
    deleteEvent,
  };
};

const validateTime = (start: string, end: string) => {
  if (!start || !end) return;

  const startDate = new Date(`2000-01-01T${start}`);
  const endDate = new Date(`2000-01-01T${end}`);

  return startDate >= endDate;
};

// 겹치는 일정을 찾는 함수
const findOverlappingEvents = (events: Event[], newEvent: Event): Event[] => {
  return events.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent),
  );
};
