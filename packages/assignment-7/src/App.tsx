import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Select,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import CalendarView from './components/CalendarView';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import OverlapDialog from './components/OverlapDialog';
import NotificationList from './components/NotificationList';
import { useCalendar } from './hooks/useCalendar';
import { useEvents } from './hooks/useEvents';
import { useForm } from './hooks/useForm';
import { Event, EventFormData } from './types';
import { useNotifications } from './hooks/useNotifications';
import { findOverlappingEvents, searchEvents } from './utils/event';

function App() {
  const {
    currentDate,
    view,
    holidays,
    navigate,
    changeView,
    formatWeek,
    formatMonth,
    getWeekDates,
    getDaysInMonth,
  } = useCalendar();

  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } =
    useEvents();

  const {
    event: formEvent,
    setEvent: setFormEvent,
    handleInputChange,
    handleCheckboxChange,
    validateForm,
    resetForm,
    validateTime,
    editEvent,
  } = useForm();

  const { notifiedEvents, notifications, removeNotification } =
    useNotifications(events);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEventSubmit = async (eventData: EventFormData) => {
    if (validateForm()) {
      const overlapping = findOverlappingEvents(eventData, events);
      if (overlapping.length > 0) {
        setOverlappingEvents(overlapping);
        setIsOverlapDialogOpen(true);
      } else {
        await saveEvent(eventData);
      }
    }
  };

  const saveEvent = async (eventData: EventFormData) => {
    if (eventData.id) {
      await updateEvent(eventData);
    } else {
      await addEvent(eventData);
    }
    resetForm();
    fetchEvents();
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(events, searchTerm);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box w='full' h='100vh' m='auto' p={5}>
      <Flex gap={6} h='full'>
        <EventForm
          event={formEvent}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onSubmit={handleEventSubmit}
          validateTime={validateTime}
        />

        <VStack flex={1} spacing={5} align='stretch'>
          <Heading>일정 보기</Heading>

          <HStack mx='auto' justifyContent='space-between'>
            <IconButton
              aria-label='Previous'
              icon={<ChevronLeftIcon />}
              onClick={() => navigate('prev')}
            />
            <Select
              aria-label='view'
              value={view}
              onChange={(e) => changeView(e.target.value as 'week' | 'month')}
            >
              <option value='week'>Week</option>
              <option value='month'>Month</option>
            </Select>
            <IconButton
              aria-label='Next'
              icon={<ChevronRightIcon />}
              onClick={() => navigate('next')}
            />
          </HStack>

          <CalendarView
            view={view}
            currentDate={currentDate}
            events={filteredEvents}
            notifiedEvents={notifiedEvents}
            formatWeek={formatWeek}
            formatMonth={formatMonth}
            getWeekDates={getWeekDates}
            getDaysInMonth={getDaysInMonth}
            holidays={holidays}
          />
        </VStack>

        <EventList
          events={filteredEvents}
          notifiedEvents={notifiedEvents}
          onEditEvent={editEvent}
          onDeleteEvent={deleteEvent}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />
      </Flex>

      <OverlapDialog
        isOpen={isOverlapDialogOpen}
        onClose={() => setIsOverlapDialogOpen(false)}
        onContinue={() => {
          setIsOverlapDialogOpen(false);
          saveEvent(formEvent);
        }}
        overlappingEvents={overlappingEvents}
      />

      <NotificationList
        notifications={notifications}
        onClose={removeNotification}
      />
    </Box>
  );
}

export default App;
