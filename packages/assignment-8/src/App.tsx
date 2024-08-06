import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  useDisclosure,
  useInterval,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { NotificationView } from './components/NotificationView';
import { AlertView } from './components/AlertView';
import { Event } from './types/types';
import { EventDetailView } from './components/EventDetailView';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { isDateInRange } from './lib/utils/date';
import { EventForm } from './components/EventForm';

const dummyEvents: Event[] = [];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchHolidays = (year: number, month: number) => {
  // 공공API를 붙여보려 하였으나 serviceKey를 숨길 방법이 없어 이대로 유지합니다.
  // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
  return {
    '2024-01-01': '신정',
    '2024-02-09': '설날',
    '2024-02-10': '설날',
    '2024-02-11': '설날',
    '2024-03-01': '삼일절',
    '2024-05-05': '어린이날',
    '2024-06-06': '현충일',
    '2024-08-15': '광복절',
    '2024-09-16': '추석',
    '2024-09-17': '추석',
    '2024-09-18': '추석',
    '2024-10-03': '개천절',
    '2024-10-09': '한글날',
    '2024-12-25': '크리스마스',
  };
};

const initialFormData: Omit<Event, 'id'> = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '업무',
  repeat: {
    type: 'none',
    interval: 1,
    endDate: '',
  },
  notificationTime: 10,
};

function App() {
  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [formData, setFormData] = useState<Omit<Event, 'id'>>(initialFormData);
  const updateFormData = <K extends keyof Event>(key: K, value: Event[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const [timeError, setTimeError] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const updateTimeError = (type: 'start' | 'end', message: string | null) => {
    setTimeError((prev) => ({ ...prev, [type]: message }));
  };
  const [view, setView] = useState<'week' | 'month'>('month');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const closeNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // overlapDialogDisclosure
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState('');
  const [holidays] = useState<Record<string, string>>(() =>
    fetchHolidays(2024, 1)
  );

  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addOrUpdateEvent = async () => {
    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    validateTime(formData.startTime, formData.endTime);
    if (timeError.start || timeError.end) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      ...formData,
      repeat: {
        type: formData.repeat?.type || 'none',
        interval: formData.repeat?.interval || 1,
        endDate: formData.repeat?.endDate || '',
      },
    };

    const overlapping = findOverlappingEvents(eventData);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      onOpen();
    } else {
      await saveEvent(eventData);
    }
  };

  const saveEvent = async (eventData: Event) => {
    try {
      let response;
      if (editingEvent) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      setEditingEvent(null);
      resetForm();
      toast({
        title: editingEvent
          ? '일정이 수정되었습니다.'
          : '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: '일정 저장 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const continueSaving = () => {
    saveEvent({
      id: editingEvent ? editingEvent.id : Date.now(),
      ...formData,
    });
    onClose();
  };

  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      toast({
        title: '일정이 삭제되었습니다.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkUpcomingEvents = async () => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      if (event.notificationTime === undefined) return false;
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime &&
        !notifiedEvents.includes(event.id)
      );
    });

    for (const event of upcomingEvents) {
      try {
        setNotifications((prev) => [
          ...prev,
          {
            id: event.id,
            message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
          },
        ]);
        setNotifiedEvents((prev) => [...prev, event.id]);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
  };

  const validateTime = (start?: string, end?: string) => {
    if (!start || !end) return;

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      updateTimeError('start', '시작 시간은 종료 시간보다 빨라야 합니다.');
      updateTimeError('end', '종료 시간은 시작 시간보다 늦어야 합니다.');
    } else {
      updateTimeError('start', null);
      updateTimeError('end', null);
    }
  };

  // 날짜 문자열을 Date 객체로 변환하는 함수
  const parseDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}`);
  };

  // 두 일정이 겹치는지 확인하는 함수
  const isOverlapping = (event1: Event, event2: Event): boolean => {
    const start1 = parseDateTime(event1.date, event1.startTime);
    const end1 = parseDateTime(event1.date, event1.endTime);
    const start2 = parseDateTime(event2.date, event2.startTime);
    const end2 = parseDateTime(event2.date, event2.endTime);

    return start1 < end2 && start2 < end1;
  };

  // 겹치는 일정을 찾는 함수
  const findOverlappingEvents = (newEvent: Event): Event[] => {
    return events.filter(
      (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const editEvent = (event: Event) => {
    setFormData(event);
  };

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  const searchEvents = (term: string) => {
    if (!term.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event?.description?.toLowerCase().includes(term.toLowerCase()) ||
        event?.location?.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(searchTerm);
    return filtered.filter((event) => {
      const eventDate = new Date(event.date);
      return isDateInRange(eventDate, currentDate, view);
    });
  })();

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm
          formData={formData}
          updateFormdata={updateFormData}
          editingEvent={editingEvent}
          validateTime={validateTime}
          timeError={timeError}
          onSave={addOrUpdateEvent}
        />
        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={() => navigate('prev')}
            />
            <Select
              aria-label="view"
              value={view}
              onChange={(e) => setView(e.target.value as 'week' | 'month')}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={() => navigate('next')}
            />
          </HStack>

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
            />
          )}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              holidays={holidays}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
            />
          )}
        </VStack>

        <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
          <FormControl>
            <FormLabel>일정 검색</FormLabel>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>

          {filteredEvents.length === 0 ? (
            <Text>검색 결과가 없습니다.</Text>
          ) : (
            filteredEvents.map((event) => (
              <EventDetailView
                key={`${event.id}-${event.date}-${event.title}`}
                {...event}
                notifiedEvents={notifiedEvents}
                editEvent={editEvent}
                deleteEvent={deleteEvent}
              />
            ))
          )}
        </VStack>
      </Flex>

      <AlertView
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        overlappingEvents={overlappingEvents}
        continueSaving={continueSaving}
      />

      {notifications.length > 0 && (
        <NotificationView
          notifications={notifications}
          closeNotification={closeNotification}
        />
      )}
    </Box>
  );
}

export default App;
