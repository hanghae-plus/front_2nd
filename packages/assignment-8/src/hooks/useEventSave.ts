import { useToast } from "@chakra-ui/react";
import { Event } from "../type/schedule.type";

export const useEventSave = (fetchEvents: () => void) => {
  const toast = useToast();

  const saveEvent = async (eventData: Event, isEditing: boolean) => {
    try {
      const response = await fetch(
        isEditing ? `/api/events/${eventData.id}` : "/api/events",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) throw new Error("Failed to save event");

      await fetchEvents();
      toast({
        title: isEditing ? "일정이 수정되었습니다." : "일정이 추가되었습니다.",
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

  return { saveEvent };
};
