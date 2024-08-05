import { useToast } from "@chakra-ui/react";

/**
 * 이벤트 삭제 커스텀 훅
 * @param fetchEvents
 * @returns
 */
export const useDeleteEvent = (fetchEvents: () => Promise<void>) => {
  const toast = useToast();
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
  return { deleteEvent };
};
