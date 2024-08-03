import React from 'react';
import { VStack, Text, Button } from '@chakra-ui/react';

const EventList = ({ events, editEvent, deleteEvent, searchTerm, setSearchTerm }) => {
  const filteredEvents = events.filter(event => event.title.includes(searchTerm));

  return (
    <VStack>
      {filteredEvents.map(event => (
        <VStack key={event.id} border="1px solid" p={3}>
          <Text>{event.title}</Text>
          <Text>{event.date}</Text>
          <Button onClick={() => editEvent(event)}>Edit</Button>
          <Button onClick={() => deleteEvent(event.id)}>Delete</Button>
        </VStack>
      ))}
    </VStack>
  );
};

export default EventList;
