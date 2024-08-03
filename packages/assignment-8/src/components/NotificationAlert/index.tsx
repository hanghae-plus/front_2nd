import { Notification, SetState } from "@/types";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  VStack,
} from "@chakra-ui/react";

interface Props {
  notifications: Array<Notification>;
  setNotifications: SetState<Array<Notification>>;
}
const NotificationAlert = ({ notifications, setNotifications }: Props) => {
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
};

export default NotificationAlert;
