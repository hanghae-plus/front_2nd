import { useState, useEffect, useCallback } from 'react';
import { Event } from '../types/types';

type Notification = {
  id: number;
  message: string;
};

export const useEventNotifications = (events: Event[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const checkUpcomingEvents = useCallback(() => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return timeDiff > 0 && timeDiff <= event.notificationTime && !notifiedEvents.includes(event.id);
    });

    upcomingEvents.forEach((event) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: event.id,
          message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
        },
      ]);
      setNotifiedEvents((prev) => [...prev, event.id]);
    });
  }, [events, notifiedEvents]);

  useEffect(() => {
    const intervalId = setInterval(checkUpcomingEvents, 1000); // 1분마다 체크
    return () => clearInterval(intervalId);
  }, [checkUpcomingEvents]);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return {
    notifications,
    removeNotification,
    notifiedEvents,
  };
};
