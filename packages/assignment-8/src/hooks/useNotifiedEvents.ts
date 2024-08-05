import { useState } from "react";
import { useInterval } from "@chakra-ui/react";
import { EventType } from "../types/event";

type useNotifiedEventsProps = {
  events: EventType[] | undefined;
  now: Date;
};

const useNotifiedEvents = ({ events, now }: useNotifiedEventsProps) => {
  const [notifications, setNotifications] = useState<
    {
      id: number;
      message: string;
    }[]
  >([]);

  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const checkUpcomingEvents = () => {
    const upcomingEvents = events?.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);

      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime &&
        !notifiedEvents.includes(event.id)
      );
    });
    upcomingEvents?.forEach((event) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: event.id,
          message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
        },
      ]);
      setNotifiedEvents((prev) => [...prev, event.id]);
    });
  };

  const filterNotifications = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  useInterval(checkUpcomingEvents, 1000);
  return {
    notifications,
    notifiedEvents,
    filterNotifications,
  };
};

export default useNotifiedEvents;
