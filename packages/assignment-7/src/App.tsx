import { useEffect, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Event } from './types/types';

import { useEventForm, useEventCRUD, useCalendarSearch, useEventNotifications } from './hooks';
import EventForm from './components/EventForm';
import { NotificationList } from './components/NotificationList';
import EventSearch from './components/EventSearch';
import WeekView from './components/calendar/WeekView';
import MonthView from './components/calendar/MonthView';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const fetchHolidays = async (year: number, month: number): Promise<{ [key: string]: string }> => {
  try {
    const response = await axios.get<{ [key: string]: string }>(`/holiday/${year}/${month}`);
    return response.data;
  } catch (error) {
    console.error('에러 발생:', error);
    return {};
  }
};

function App() {
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useEventCRUD();

  const { formData, setField, resetForm, addOrUpdateEvent, setFormData, validateTime } = useEventForm(events);

  const { searchTerm, setSearchTerm, view, setView, currentDate, filteredEvents, navigate } = useCalendarSearch(events);

  const { notifications, removeNotification, notifiedEvents } = useEventNotifications(events);

  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [pendingEventData, setPendingEventData] = useState<Event | null>(null);

  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const cancelRef = useRef<HTMLButtonElement>(null);

  // 추가, 수정 핸들러
  const handleAddOrUpdateEvent = async () => {
    const result = await addOrUpdateEvent();
    if (result.success && result.eventData) {
      await saveEvent(result.eventData);
      resetForm();
    } else if (result.overlappingEvents) {
      setOverlappingEvents(result.overlappingEvents);
      setPendingEventData(result.eventData);
      setIsOverlapDialogOpen(true);
    }
  };

  // 겹침 일정일때 계속 진행 클릭
  const handleConfirmOverlap = async () => {
    if (pendingEventData) {
      await saveEvent(pendingEventData);
      resetForm();
      setIsOverlapDialogOpen(false);
      setPendingEventData(null);
    }
  };

  // 이벤트 저장 (수정,저장)
  const saveEvent = async (eventData: Event) => {
    if (isEditingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    setIsEditingEvent(false);
    resetForm();
  };

  // 수정 클릭시
  const onClickEditEvent = (event: Event) => {
    setIsEditingEvent(true);
    setFormData(event);
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const getHolidays = async () => {
      const newHolidays = await fetchHolidays(year, month);
      setHolidays(newHolidays);
    };
    getHolidays();
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box w='full' h='100vh' m='auto' p={5}>
      <Flex gap={6} h='full'>
        {/* form */}
        <EventForm
          isEditingEvent={isEditingEvent}
          handleAddOrUpdateEvent={handleAddOrUpdateEvent}
          formData={formData}
          setField={setField}
          validateTime={validateTime}
        />
        {/* calendar */}
        <VStack flex={1} spacing={5} align='stretch'>
          <Heading>일정 보기</Heading>

          <HStack mx='auto' justifyContent='space-between'>
            <IconButton aria-label='Previous' icon={<ChevronLeftIcon />} onClick={() => navigate('prev')} />
            <Select aria-label='view' value={view} onChange={(e) => setView(e.target.value as 'week' | 'month')}>
              <option value='week'>Week</option>
              <option value='month'>Month</option>
            </Select>
            <IconButton aria-label='Next' icon={<ChevronRightIcon />} onClick={() => navigate('next')} />
          </HStack>

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              notifiedEvents={notifiedEvents}
              holidays={holidays}
            />
          )}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              notifiedEvents={notifiedEvents}
              holidays={holidays}
            />
          )}
        </VStack>

        {/* search */}
        <EventSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          onClickEditEvent={onClickEditEvent}
          deleteEvent={deleteEvent}
          notifiedEvents={notifiedEvents}
        />
      </Flex>

      <AlertDialog
        isOpen={isOverlapDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOverlapDialogOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              일정 겹침 경고
            </AlertDialogHeader>

            <AlertDialogBody>
              다음 일정과 겹칩니다:
              {overlappingEvents.map((event) => (
                <Text key={event.id}>
                  {event.title} ({event.date} {event.startTime}-{event.endTime})
                </Text>
              ))}
              계속 진행하시겠습니까?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOverlapDialogOpen(false)}>
                취소
              </Button>
              <Button colorScheme='red' onClick={handleConfirmOverlap} ml={3}>
                계속 진행
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {notifications.length > 0 && (
        <NotificationList notifications={notifications} removeNotification={removeNotification} />
      )}
    </Box>
  );
}

export default App;
