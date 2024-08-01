import { useState, useCallback, useEffect } from 'react';
import { Event } from '../types';

interface Notification {
  id: number;
  message: string;
}

export function useNotifications(events: Event[]) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const addNotification = useCallback((message: string) => {
    const newNotification = { id: Date.now(), message };
    setNotifications((prev) => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const checkUpcomingEvents = useCallback(() => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime &&
        !notifiedEvents.includes(event.id)
      );
    });

    upcomingEvents.forEach((event) => {
      addNotification(
        `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`
      );
      setNotifiedEvents((prev) => [...prev, event.id]);
    });
  }, [events, notifiedEvents, addNotification]);

  useEffect(() => {
    const intervalId = setInterval(checkUpcomingEvents, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [checkUpcomingEvents]);

  return {
    notifications,
    addNotification,
    removeNotification,
    notifiedEvents,
  };
}
