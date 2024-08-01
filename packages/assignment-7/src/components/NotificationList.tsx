import {
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Box,
} from '@chakra-ui/react';

interface Notification {
  id: number;
  message: string;
}

interface NotificationListProps {
  notifications: Notification[];
  onClose: (id: number) => void;
}

function NotificationList({ notifications, onClose }: NotificationListProps) {
  if (notifications.length === 0) {
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
      {notifications.map((notification) => (
        <Alert key={notification.id} status='info' variant='solid' width='auto'>
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle fontSize='sm'>{notification.message}</AlertTitle>
          </Box>
          <CloseButton
            onClick={() => onClose(notification.id)}
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
