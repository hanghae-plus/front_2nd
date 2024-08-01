import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EventType } from "../types/event";

const useGetEvents = () => {
  const toast = useToast();
  const [events, setEvents] = useState<EventType[]>([]);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, fetchEvents };
};

export default useGetEvents;
