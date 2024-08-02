import React, { useState } from 'react';
import { Button, Input, VStack } from '@chakra-ui/react';

const EventForm = ({ addOrUpdateEvent, editingEvent, setEditingEvent }) => {
  const [title, setTitle] = useState(editingEvent ? editingEvent.title : '');
  const [date, setDate] = useState(editingEvent ? editingEvent.date : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && date) {
      addOrUpdateEvent({ title, date });
      setTitle('');
      setDate('');
      setEditingEvent(null);
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit}>
      <Input
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </VStack>
  );
};

export default EventForm;
