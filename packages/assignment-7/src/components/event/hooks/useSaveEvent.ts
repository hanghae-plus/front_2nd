import { Event } from "../../../App";
import { useToast } from "@chakra-ui/react";

/**
 * 일정 Mutation 커스텀 훅
 * @param fetchEvents
 * @returns
 */
export const useSaveEvent = (fetchEvents: () => Promise<void>) => {
  const toast = useToast();

  const saveEvent = async (eventData: Event, editingEvent?: Event | null) => {
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

      // 이벤트 목록 새로고침
      await fetchEvents();
      toast({
        title: editingEvent?.title
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

  return {
    saveEvent,
  };
};
