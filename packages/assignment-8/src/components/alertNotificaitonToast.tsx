import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  VStack,
} from "@chakra-ui/react";
import { notificationsStore } from "../store/notificationsStore";

export const AlertNotificationToast = () => {
  const { notifications, setNotifications } = notificationsStore();

  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <Alert
          role="alert-notification"
          key={index}
          status="info"
          variant="solid"
          width="auto"
        >
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
  );
};
