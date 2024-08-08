import { Event, SetState } from "@/types";
import getEventGeneratedRepeatChildren from "@/utils/getEventGeneratedRepeatChildren";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  events: Array<Event>;
  validateSubmitEventForm: () => Promise<boolean>;
  eventFormData: Omit<Event, "id">;
  getIsOverlappingAndSetOverlappingEvents: (newEvent: Event) => boolean;
  editingEvent: Event | null;
  setEditingEvent: SetState<Event | null>;
  resetForm: () => void;
  setEvents: SetState<Array<Event>>;
}
const useEventManager = ({
  events,
  validateSubmitEventForm,
  eventFormData,
  getIsOverlappingAndSetOverlappingEvents,
  editingEvent,
  setEditingEvent,
  resetForm,
  setEvents,
}: Props) => {
  const toast = useToast();

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

    if (editingEvent && editingEvent.parentId) {
      console.log("반복 이벤트 수정", editingEvent);
    }

    const isOverlapping = getIsOverlappingAndSetOverlappingEvents(eventData);

    if (isOverlapping) {
      return;
    }

    await saveEvent(eventData);
  };

  /**
   * 서버에서 일정 정보 가져오기
   */
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const events = await response.json().then((res) =>
        res.map((event: Event) => {
          if (event.children) {
            return event;
          }
          return getEventGeneratedRepeatChildren(event);
        })
      );

      setEvents(events);
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
   * 일정 생성 및 수정 기능 중 저장하기 눌렀을 때
   */
  const saveEvent = async (eventData: Event) => {
    try {
      let response;

      const newEvent = getEventGeneratedRepeatChildren(eventData);

      if (editingEvent) {
        response = await fetch(`/api/events/${newEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
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

  const putEdittedEvent = async (eventData: Event) => {
    try {
      const response = await fetch(`/api/events/${eventData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
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

  const [isReapetEventRemoveDialogOpen, setIsRepeatEventRemoveDialogOpen] =
    useState<boolean>(false);
  const [removingEvent, setRemovingEvent] = useState<Event>();

  const onClickRemoveParent = () => {
    deleteEvent(
      events.filter((event) => event.id === removingEvent?.parentId)[0]
    );
    setIsRepeatEventRemoveDialogOpen(false);
  };

  const onClickRemoveOnlyTargetChild = () => {
    const parentEvent = events.filter(
      (event) => event.id === removingEvent?.parentId
    )[0];

    const edittedEvent: Event = {
      ...parentEvent,
      children: parentEvent.children?.filter(
        (child) => child.id !== removingEvent?.id
      ),
    };
    putEdittedEvent(edittedEvent);
    setIsRepeatEventRemoveDialogOpen(false);
  };

  /**
   * 일정 삭제 눌렀을 때
   */
  const deleteEvent = async (event: Event) => {
    if (event.parentId) {
      setRemovingEvent(event);
      setIsRepeatEventRemoveDialogOpen(true);
      return;
    }
    try {
      const response = await fetch(`/api/events/${event.id}`, {
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
  const repeatEventRemoveDialog = {
    isReapetEventRemoveDialogOpen,
    setIsRepeatEventRemoveDialogOpen,
    onClickRemoveParent,
    onClickRemoveOnlyTargetChild,
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    addOrUpdateEvent,
    saveEvent,
    deleteEvent,

    repeatEventRemoveDialog,
  };
};

export default useEventManager;
