import { useState } from 'react';
import { Event } from "../types";
import { createNotificationMessage, getUpcomingEvents } from "../utils/notificationUtils";
import { useInterval } from "@chakra-ui/react";

export const useNotifications = (events: Event[]) => {
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const checkUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);

    setNotifications(prev => [
      ...prev,
      ...upcomingEvents.map(event => ({
        id: event.id,
        message: createNotificationMessage(event),
      }))
    ]);

    setNotifiedEvents(prev => [
      ...prev,
      ...upcomingEvents.map(({ id }) => id),
    ]);
  };


  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  return { notifications, notifiedEvents, setNotifications, removeNotification };
};
