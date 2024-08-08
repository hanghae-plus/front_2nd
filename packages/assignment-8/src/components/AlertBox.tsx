import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  VStack,
} from '@chakra-ui/react';
import { Notification } from '../hooks/useEventNotifications';

interface Props {
  notifications: Notification[];
  removeNotification: (index: number) => void;
}

export default function AlertBox({ notifications, removeNotification }: Props) {
  if (!notifications.length) return null;
  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <Alert key={index} status="info" variant="solid" width="auto">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
          </Box>
          <CloseButton onClick={() => removeNotification(index)} />
        </Alert>
      ))}
    </VStack>
  );
}
