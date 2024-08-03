import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  VStack,
} from "@chakra-ui/react";

interface EventNotificationProps {
  notifications: {
    id: number;
    message: string;
  }[];
  setNotifications: (
    value: React.SetStateAction<
      {
        id: number;
        message: string;
      }[]
    >
  ) => void;
}

const EventNotification = ({
  notifications,
  setNotifications,
}: EventNotificationProps) => {
  return (
    <>
      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => {
            const setNotification = () => {
              setNotifications((prev) => prev.filter((_, i) => i !== index));
            };
            return (
              <EventNotificationView
                key={notification.id}
                id={notification.id}
                message={notification.message}
                onClickUpdateNotifications={setNotification}
              />
            );
          })}
        </VStack>
      )}
    </>
  );
};

interface EventNotificationViewProps {
  id: number;
  message: string;
  onClickUpdateNotifications: () => void;
}

const EventNotificationView = ({
  id,
  message,
  onClickUpdateNotifications,
}: EventNotificationViewProps) => {
  return (
    <Alert key={id} status="info" variant="solid" width="auto">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle fontSize="sm">{message}</AlertTitle>
      </Box>
      <CloseButton onClick={onClickUpdateNotifications} />
    </Alert>
  );
};

export default EventNotification;
