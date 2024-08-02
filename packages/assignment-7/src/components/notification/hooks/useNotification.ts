import { useState } from "react";
import { Event } from "../../../App";
/**
 * 다가오는 이벤트와 알림 데이터
 * @param events
 * @returns
 */
export const useNotification = (events: Event[]) => {
  // 다가오는 이벤트
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);

  /**
   * 현재 날짜 기준으로의 다가오는 events
   */
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
        console.error("Error updating notification status:", error);
      }
    }
  };

  return {
    checkUpcomingEvents,
    notifications,
    notifiedEvents,
    setNotifications,
    setNotifiedEvents,
  };
};
