import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Event } from "../../../App";

const dummyEvents: Event[] = [];

export const useGetEvent = () => {
  const [events, setEvents] = useState<Event[]>(dummyEvents);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, fetchEvents };
};
