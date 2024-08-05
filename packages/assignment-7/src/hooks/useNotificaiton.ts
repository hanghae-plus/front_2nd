import { useState } from 'react';
import { Event } from '../types';
import { useInterval } from '@chakra-ui/react';

function useNotification(events: Event[]) {
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const checkUpcomingEvents = async () => {
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

    for (const event of upcomingEvents) {
      try {
        setNotifications((prev) => [
          ...prev,
          {
            id: event.id,
            message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
          },
        ]);
        setNotifiedEvents((prev) => [...prev, event.id]);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
  };

  useInterval(checkUpcomingEvents, 1000);

  return {
    notifications,
    setNotifications,
    notifiedEvents,
    setNotifiedEvents,
  };
}

export default useNotification;
