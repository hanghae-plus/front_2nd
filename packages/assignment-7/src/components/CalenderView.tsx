import React from 'react';
import { VStack, Text } from '@chakra-ui/react';

const CalendarView = ({ view, currentDate, filteredEvents }) => {
  return (
    <VStack>
      <Text>{view} view of {currentDate.toDateString()}</Text>
      {filteredEvents.map(event => (
        <Text key={event.id}>{event.title}</Text>
      ))}
    </VStack>
  );
};

export default CalendarView;
