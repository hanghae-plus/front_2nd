import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterval } from '@chakra-ui/react';
import { Event } from '../interface';

export interface Notification {
  id: number;
  message: string;
}

export const useEventNotifications = (events: Event[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notifiedEventsRef = useRef<Set<number>>(new Set());

  const checkUpcomingEvents = useCallback(() => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime! &&
        !notifiedEventsRef.current.has(event.id)
      );
    });

    upcomingEvents.forEach((event) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: event.id,
          message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
        },
      ]);
      notifiedEventsRef.current.add(event.id);
    });
  }, [events]);

  const removeNotification = useCallback((index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 컴포넌트가 마운트될 때와 events가 변경될 때마다 한 번씩 체크
  useEffect(() => {
    checkUpcomingEvents();
  }, [events, checkUpcomingEvents]);

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  return {
    notifications,
    removeNotification,
    notifiedEventsRef,
  };
};
