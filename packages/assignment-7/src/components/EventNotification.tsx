import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  VStack,
} from '@chakra-ui/react';

interface EventNotificationProps {
  notifications: { message: string }[];
  setNotifications: React.Dispatch<
    React.SetStateAction<{ id: number; message: string }[]>
  >;
}

function EventNotification({
  notifications,
  setNotifications,
}: EventNotificationProps) {
  return (
    <>
      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
            <Alert key={index} status="info" variant="solid" width="auto">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
              </Box>
              <CloseButton
                onClick={() =>
                  setNotifications((prev) => prev.filter((_, i) => i !== index))
                }
              />
            </Alert>
          ))}
        </VStack>
      )}
    </>
  );
}

export default EventNotification;
