import React from 'react';
import { Box, VStack, Text, CloseButton, AlertTitle, AlertIcon, Alert } from '@chakra-ui/react';

type Notification = {
  id: number;
  message: string;
};

type NotificationListProps = {
  notifications: Notification[];
  removeNotification: (id: number) => void;
};

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, removeNotification }) => {
  return (
    <VStack position='fixed' top={4} right={4} spacing={2} align='flex-end'>
      {notifications.map((notification, index) => (
        <Alert key={index} status='info' variant='solid' width='auto'>
          <AlertIcon />
          <Box flex='1'>
            <AlertTitle fontSize='sm'>{notification.message}</AlertTitle>
          </Box>
          <CloseButton onClick={() => removeNotification(notification.id)} />
        </Alert>
      ))}
    </VStack>
  );
};
