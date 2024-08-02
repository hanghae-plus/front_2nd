import { ChangeEvent, useEffect,  useState } from 'react';
import {RepeatType, Event} from "./types/types.ts";
import {getWeekDates} from "./utils/utilsFunc.ts";


// Components
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Flex,
  useInterval,
  useToast,
  VStack,
} from '@chakra-ui/react';
import AlertConfirm from "./components/AlertConfirm.tsx";
import EventForm from "./components/EventForm.tsx";
import EventList from "./components/EventList";
import Calendar from "./components/calendar/Calendar.tsx";


const dummyEvents: Event[] = [];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchHolidays = (year: number, month: number) => {
  // 실제로는 API를 호출하여 공휴일 정보를 가져와야 합니다.
  // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
  return {
    "2024-01-01": "신정",
    "2024-02-09": "설날",
    "2024-02-10": "설날",
    "2024-02-11": "설날",
    "2024-03-01": "삼일절",
    "2024-05-05": "어린이날",
    "2024-06-06": "현충일",
    "2024-08-15": "광복절",
    "2024-09-16": "추석",
    "2024-09-17": "추석",
    "2024-09-18": "추석",
    "2024-10-03": "개천절",
    "2024-10-09": "한글날",
    "2024-12-25": "크리스마스"
  };
};




function App() {
  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState<'week' | 'month'>('month');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [notificationTime, setNotificationTime] = useState(10);
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);


  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState('');
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

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
        title: "이벤트 로딩 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: "필수 정보를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    validateTime(startTime, endTime);
    if (startTimeError || endTimeError) {
      toast({
        title: "시간 설정을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
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
        title: editingEvent ? "일정이 수정되었습니다." : "일정이 추가되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "일정 저장 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
        title: "일정이 삭제되었습니다.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "일정 삭제 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkUpcomingEvents = async () => {
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return timeDiff > 0 && timeDiff <= event.notificationTime && !notifiedEvents.includes(event.id);
    });

    for (const event of upcomingEvents) {
      try {
        setNotifications(prev => [...prev, {
          id: event.id,
          message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`
        }]);
        setNotifiedEvents(prev => [...prev, event.id]);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
  };

  const validateTime = (start: string, end: string) => {
    if (!start || !end) return;

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      setStartTimeError("시작 시간은 종료 시간보다 빨라야 합니다.");
      setEndTimeError("종료 시간은 시작 시간보다 늦어야 합니다.");
    } else {
      setStartTimeError(null);
      setEndTimeError(null);
    }
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    validateTime(newStartTime, endTime);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    validateTime(startTime, newEndTime);
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
    return events.filter(event =>
        event.id !== newEvent.id && isOverlapping(event, newEvent)
    );
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setLocation('');
    setCategory('');
    setEditingEvent(null);
    setIsRepeating(false);
    setRepeatType('none');
    setRepeatInterval(1);
    setRepeatEndDate('');
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setLocation(event.location);
    setCategory(event.category);
    setIsRepeating(event.repeat.type !== 'none');
    setRepeatType(event.repeat.type);
    setRepeatInterval(event.repeat.interval);
    setRepeatEndDate(event.repeat.endDate || '');
    setNotificationTime(event.notificationTime);
  };

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
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

    return events.filter(event =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(searchTerm);
    return filtered.filter(event => {
      const eventDate = new Date(event.date);
      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === 'month') {
        return eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear();
      }
      return true;
    })
  })();

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
      <Box w="full" h="100vh" m="auto" p={5}>
        <Flex gap={6} h="full">
          <EventForm
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            startTime={startTime}
            endTime={endTime}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            category={category}
            setCategory={setCategory}
            isRepeating={isRepeating}
            setIsRepeating={setIsRepeating}
            repeatType={repeatType}
            setRepeatType={setRepeatType}
            repeatInterval={repeatInterval}
            setRepeatInterval={setRepeatInterval}
            repeatEndDate={repeatEndDate}
            setRepeatEndDate={setRepeatEndDate}
            editingEvent={editingEvent}
            startTimeError={startTimeError}
            handleStartTimeChange={handleStartTimeChange}
            validateTime={validateTime}
            endTimeError={endTimeError}
            handleEndTimeChange={handleEndTimeChange}
            notificationTime={notificationTime}
            setNotificationTime={setNotificationTime}
            addOrUpdateEvent={addOrUpdateEvent}
          />

          <Calendar
              view={view}
              setView={setView}
              navigate={navigate}
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              holidays={holidays}
          />

          <EventList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        </Flex>


        <AlertConfirm
            data-testid="alert-dialog"
            isOverlapDialogOpen={isOverlapDialogOpen}
            setIsOverlapDialogOpen={setIsOverlapDialogOpen}
            overlappingEvents={overlappingEvents}
            saveEvent={saveEvent}
            editingEvent={editingEvent}
            title={title}
            date={date}
            startTime={startTime}
            endTime={endTime}
            description={description}
            location={location}
            category={category}
            isRepeating={isRepeating}
            repeatType={repeatType}
            repeatInterval={repeatInterval}
            repeatEndDate={repeatEndDate}
            notificationTime={notificationTime}
        />

        {notifications.length > 0 && <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
              <Alert key={index} status="info" variant="solid" width="auto" data-testid="alert">
                <AlertIcon/>
                <Box flex="1">
                  <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
                </Box>
                <CloseButton onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}/>
              </Alert>
          ))}
        </VStack>
        }
      </Box>
  );
}

export default  App;



