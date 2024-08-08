import { ChangeEvent, useMemo, useState } from 'react';
import { VStack, Text } from '@chakra-ui/react';
import { useSchedulerContext } from '../contexts/SchedulerContext';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import { Event } from '../types';
import { searchEvents } from '../utils/event';
import { getWeekDates } from '../utils/date';

function EventList() {
  const { events, calendar, notifications, setSelectedEvent } =
    useSchedulerContext();
  const { events: eventList, deleteEvent } = events;
  const { currentDate, view } = calendar;
  const { notifiedEvents } = notifications;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = (() => {
    const filtered = searchEvents(eventList, searchTerm);

    return filtered.filter((event) => {
      const eventDate = new Date(event.date);
      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === 'month') {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
      return true;
    });
  })();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <VStack
      data-testid='event-list'
      w='500px'
      h='full'
      overflowY='auto'
      spacing={4}
    >
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      {filteredEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isNotified={notifiedEvents.includes(event.id)}
            onEdit={() => handleEdit(event)}
            onDelete={() => deleteEvent(event.id)}
          />
        ))
      )}
    </VStack>
  );
}

export default EventList;
