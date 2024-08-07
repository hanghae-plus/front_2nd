import { useEffect,  useState } from 'react';
import {Event} from "./types/types.ts";
import {addRepeatedEvent, getWeekDates, isOverlapping} from "./utils/utilsFunc.ts";
import useEvents from "./hook/useEvents.ts";
import useForm from "./hook/useForm.ts";
import useNotice from "./hook/useNotice.ts";

// Components
import {
  Box,
  Flex,
  useInterval,
  useToast,
} from '@chakra-ui/react';
import AlertConfirm from "./components/alert/AlertConfirm.tsx";
import AlertNotice from "./components/alert/AlertNotice.tsx";
import EventForm from "./components/form/EventForm.tsx";
import EventList from "./components/list/EventList.tsx";
import Calendar from "./components/calendar/Calendar.tsx";


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
  const [view, setView] = useState<'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const {events, fetchEvents, saveEvent, deleteEvent} = useEvents();

  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    editingEvent,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    editEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    startTimeError,
    endTimeError,
    validateTime
  } = useForm();
  const {
    notifications,
    setNotifications,
    notifiedEvents,
    checkUpcomingEvents
  } = useNotice(events)
  const toast = useToast();

  // 겹치는 일정을 찾는 함수
  const findOverlappingEvents = (newEvent: Event): Event[] => {
    return events.filter(event =>
        event.id !== newEvent.id && isOverlapping(event, newEvent)
    );
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
        if(isRepeating) await saveEvent(addRepeatedEvent(eventData)); else {
        if(!isRepeating) await saveEvent(eventData);
      }
    }
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

        {notifications.length > 0 && <AlertNotice notifications={notifications} setNotifications={setNotifications} />}
      </Box>
  );
}

export default  App;



