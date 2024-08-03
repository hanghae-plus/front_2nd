import {
  VStack,
  Alert,
  Box,
  AlertTitle,
  CloseButton,
  AlertIcon,
} from '@chakra-ui/react';
import { type Notification } from '../types/types';

interface NotificationProps {
  notifications: Notification[];
  closeNotification: (id: number) => void;
}

export const NotificationView = ({
  notifications,
  closeNotification,
}: NotificationProps) => {
  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <Alert key={index} status="info" variant="solid" width="auto">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
          </Box>
          <CloseButton onClick={() => closeNotification(notification.id)} />
        </Alert>
      ))}
    </VStack>
  );
};
