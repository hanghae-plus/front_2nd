import { Box, Flex, VStack } from '@chakra-ui/react';
import { EventFormView } from '@/features/eventForm';
import { useState } from 'react';

const CalendarPage = () => {
  const [isEditing] = useState<boolean>(false);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <VStack w="400px" spacing={5} align="stretch">
          <EventFormView isEditing={isEditing} />
        </VStack>
        <VStack flex={1} spacing={5} align="stretch"></VStack>
        <VStack
          data-testid="event-list"
          w="500px"
          h="full"
          overflowY="auto"
        ></VStack>
      </Flex>
    </Box>
  );
};

export default CalendarPage;
