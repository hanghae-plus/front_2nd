import {
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Box,
} from '@chakra-ui/react';
import { useSchedulerContext } from '../contexts/SchedulerContext';

function NotificationList() {
  const { notifications } = useSchedulerContext();
  const { notifications: notificationList, removeNotification } = notifications;

  if (notificationList.length === 0) {
    return null;
  }

  return (
    <VStack
      position='fixed'
      top={4}
      right={4}
      spacing={2}
      align='flex-end'
      zIndex='toast'
    >
      {notificationList.map((notification) => (
        <Alert
          key={notification.id}
          status='info'
          variant='solid'
          width='auto'
          data-testid='notification-alert'
        >
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle fontSize='sm'>{notification.message}</AlertTitle>
          </Box>
          <CloseButton
            onClick={() => removeNotification(notification.id)}
            position='absolute'
            right={1}
            top={1}
          />
        </Alert>
      ))}
    </VStack>
  );
}

export default NotificationList;
