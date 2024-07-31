import { Box, Button, Flex, Heading, HStack, IconButton, Input, Select, Text, useToast, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import EventForm from './EventForm';
import EventList from './EventList';
import CalendarView from './CalendarView';
import { useEventManagement } from './useEventManagement';

const App = () => {
  const {
    events,
    currentDate,
    setCurrentDate,
    view,
    setView,
    searchTerm,
    setSearchTerm,
    filteredEvents,
    addOrUpdateEvent,
    editEvent,
    deleteEvent,
    editingEvent,
    setEditingEvent,
  } = useEventManagement();

  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <VStack w="400px" spacing={5} align="stretch">
          <EventForm
            addOrUpdateEvent={addOrUpdateEvent}
            editingEvent={editingEvent}
            setEditingEvent={setEditingEvent}
            toast={toast}
          />
        </VStack>
        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>
          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={() => navigate('prev')}
            />
            <Select aria-label="view" value={view} onChange={(e) => setView(e.target.value)}>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={() => navigate('next')}
            />
          </HStack>
          <CalendarView view={view} currentDate={currentDate} filteredEvents={filteredEvents} />
        </VStack>
        <VStack w="500px" h="full" overflowY="auto">
          <Input
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <EventList
            events={filteredEvents}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        </VStack>
      </Flex>
    </Box>
  );
};

export default App;
