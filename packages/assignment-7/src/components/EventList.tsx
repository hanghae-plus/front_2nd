import React from 'react';
import { VStack, Text } from '@chakra-ui/react';
import { Event } from '../types';
import EventCard from './EventCard';
import SearchBar from './SearchBar';

interface EventListProps {
  events: Event[];
  notifiedEvents: number[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: number) => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EventList({
  events,
  notifiedEvents,
  onEditEvent,
  onDeleteEvent,
  searchTerm,
  onSearchChange,
}: EventListProps) {
  return (
    <VStack
      data-testid='event-list'
      w='500px'
      h='full'
      overflowY='auto'
      spacing={4}
    >
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

      {events.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isNotified={notifiedEvents.includes(event.id)}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
          />
        ))
      )}
    </VStack>
  );
}

export default EventList;
