import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  VStack,
} from "@chakra-ui/react";

interface Props {
  notifications: { id: number; message: string }[];
  closeNotification: (index: number) => void;
}

const Notifications = ({ notifications, closeNotification }: Props) => {
  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <Alert key={index} status="info" variant="solid" width="auto">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
          </Box>
          <CloseButton onClick={() => closeNotification(index)} />
        </Alert>
      ))}
    </VStack>
  );
};

export default Notifications;
