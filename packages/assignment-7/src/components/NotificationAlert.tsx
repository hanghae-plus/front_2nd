import { VStack, Alert, AlertIcon, Box, AlertTitle, CloseButton, useInterval } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { Event } from "../types";

interface Props {
  notifiedEvents: number[],
  setNotifiedEvents: Dispatch<SetStateAction<number[]>>,
  events: Event[]
}
const NotificationAlert = ({notifiedEvents, setNotifiedEvents, events}: Props) => {
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);

  const checkUpcomingEvents = async () => {
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return timeDiff > 0 && timeDiff <= event.notificationTime && !notifiedEvents.includes(event.id);
    });

    for (const event of upcomingEvents) {
      try {
        setNotifications(prev => [...prev, {
          id: event.id,
          message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`
        }]);
        setNotifiedEvents(prev => [...prev, event.id]);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
  };
  
  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  if(notifications.length <= 0) return null;

  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
        {notifications.map((notification, index) => (
          <Alert key={index} status="info" variant="solid" width="auto">
            <AlertIcon/>
            <Box flex="1">
              <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
            </Box>
            <CloseButton onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}/>
          </Alert>
        ))}
      </VStack>
  )
}

export default NotificationAlert;