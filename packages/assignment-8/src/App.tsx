import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import { categories, notificationOptions } from './constants';
import AlertBox from './components/AlertBox';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';
import useChakraToast from './hooks/useChakraToast';
import { useEvents } from './hooks/api/useEvent';
import { useEventManagement } from './hooks/api/useEventManagement';
import { useEventNotifications } from './hooks/useEventNotifications';
import useNavigateView, { View } from './hooks/useNavigateView';
import useTimeValidation from './hooks/useTimeValidation';
import { Event, FormData, RepeatType } from './interface';
import {
  findOverlappingEvents,
  getWeekDates,
  searchEvents,
} from './utils/dateUtils';

interface Props {
  fetchEventsFunction?: () => Promise<Event[]>;
}

const defaultFormData = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  isRepeating: false,
  repeatType: 'none' as RepeatType,
  repeatInterval: 1,
  repeatEndDate: '',
  notificationTime: 10,
};

function App({ fetchEventsFunction }: Props) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [view, setView] = useState<View>('month');
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const cancelRef = useRef<HTMLButtonElement>(null);

  const { events, fetchEvents } = useEvents(fetchEventsFunction);
  const { editingEvent, setEditingEvent, saveEvent, deleteEvent } =
    useEventManagement(fetchEvents);
  const { errorToast } = useChakraToast();
  const { notifications, removeNotification, notifiedEventsRef } =
    useEventNotifications(events);
  const { currentDate, navigate } = useNavigateView(view);
  const { startTimeError, endTimeError, validateTime, isTimeValid } =
    useTimeValidation();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((pre) => ({
      ...pre,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  function createEventFromFormData(
    formData: FormData,
    editingEventId?: number
  ): Event {
    const {
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      isRepeating,
      repeatType,
      repeatInterval,
      repeatEndDate,
      notificationTime,
    } = formData;
    return {
      id:
        editingEventId ?? Number(Date.now()) + Math.floor(Math.random() * 1000),
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: isRepeating
        ? {
            type: repeatType,
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
          }
        : { type: 'none', interval: 1 },
      notificationTime: notificationTime,
    };
  }

  const addOrUpdateEvent = async () => {
    const { title, date, startTime, endTime } = formData;
    if (!title || !date || !startTime || !endTime) {
      errorToast('필수 정보를 모두 입력해주세요.');
      return;
    }

    validateTime(startTime, endTime);
    if (!isTimeValid) {
      errorToast('시간 설정을 확인해주세요.');
      return;
    }

    const eventData: Event = createEventFromFormData(formData);

    const overlapping = findOverlappingEvents(events, eventData);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await handleSaveEvent(eventData);
    }
  };

  const handleSaveEvent = async (eventData: Event) => {
    await saveEvent(eventData);
    resetForm();
  };

  const handleDeleteEvent = async (id: number) => {
    await deleteEvent(id);
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setFormData((pre) => ({ ...pre, startTime: newStartTime }));
    validateTime(newStartTime, formData.endTime);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setFormData((pre) => ({ ...pre, endTime: newEndTime }));
    validateTime(formData.startTime, newEndTime);
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description ?? '',
      location: event.location ?? '',
      category: event.category ?? '',
      isRepeating: event.repeat?.type !== 'none',
      repeatType: event.repeat?.type ?? 'none',
      repeatInterval: event.repeat?.interval ?? 1,
      repeatEndDate: event.repeat?.endDate ?? '',
      notificationTime: event.notificationTime ?? 10,
    });
  };

  const getFilteredEvents = (searchedEvents: Event[]) => {
    return searchedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      }
      if (view === 'month') {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
    });
  };

  const filteredEvents = (() => {
    const searched = searchEvents(searchTerm, events);
    return getFilteredEvents(searched);
  })();

  const handleRepeatCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((pre) => ({
      ...pre,
      isRepeating: checked,
      repeatType: checked ? 'daily' : 'none',
    }));
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <VStack w="400px" spacing={5} align="stretch">
          <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange(e)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>날짜</FormLabel>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange(e)}
            />
          </FormControl>

          <HStack width="100%">
            <FormControl>
              <FormLabel>시작 시간</FormLabel>
              <Tooltip
                label={startTimeError}
                isOpen={!!startTimeError}
                placement="top"
              >
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={handleStartTimeChange}
                  onBlur={() =>
                    validateTime(formData.startTime, formData.endTime)
                  }
                  isInvalid={!!startTimeError}
                />
              </Tooltip>
            </FormControl>
            <FormControl>
              <FormLabel>종료 시간</FormLabel>
              <Tooltip
                label={endTimeError}
                isOpen={!!endTimeError}
                placement="top"
              >
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={handleEndTimeChange}
                  onBlur={() =>
                    validateTime(formData.startTime, formData.endTime)
                  }
                  isInvalid={!!endTimeError}
                />
              </Tooltip>
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>설명</FormLabel>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange(e)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>위치</FormLabel>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange(e)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>반복 설정</FormLabel>
            <Checkbox
              isChecked={formData.isRepeating}
              onChange={handleRepeatCheck}
            >
              반복 일정
            </Checkbox>
          </FormControl>

          <FormControl>
            <FormLabel>알림 설정</FormLabel>
            <Select
              value={formData.notificationTime}
              onChange={(e) => handleInputChange(e)}
            >
              {notificationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {formData.isRepeating && (
            <VStack width="100%">
              <FormControl>
                <FormLabel>반복 유형</FormLabel>
                <Select
                  value={formData.repeatType}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                  <option value="yearly">매년</option>
                </Select>
              </FormControl>
              <HStack width="100%">
                <FormControl>
                  <FormLabel>반복 간격</FormLabel>
                  <Input
                    type="number"
                    value={formData.repeatInterval}
                    onChange={(e) => handleInputChange(e)}
                    min={1}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>반복 종료일</FormLabel>
                  <Input
                    type="date"
                    value={formData.repeatEndDate}
                    onChange={(e) => handleInputChange(e)}
                  />
                </FormControl>
              </HStack>
            </VStack>
          )}

          <Button
            data-testid="event-submit-button"
            onClick={addOrUpdateEvent}
            colorScheme="blue"
          >
            {editingEvent ? '일정 수정' : '일정 추가'}
          </Button>
        </VStack>

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
              notifiedEventsRef={notifiedEventsRef}
            />
          )}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEventsRef={notifiedEventsRef}
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
              <Box
                key={event.id}
                borderWidth={1}
                borderRadius="lg"
                p={3}
                width="100%"
              >
                <HStack justifyContent="space-between">
                  <VStack align="start">
                    <HStack>
                      {notifiedEventsRef.current.has(event.id) && (
                        <BellIcon color="red.500" />
                      )}
                      <Text
                        fontWeight={
                          notifiedEventsRef.current.has(event.id)
                            ? 'bold'
                            : 'normal'
                        }
                        color={
                          notifiedEventsRef.current.has(event.id)
                            ? 'red.500'
                            : 'inherit'
                        }
                      >
                        {event.title}
                      </Text>
                    </HStack>
                    <Text>
                      {event.date} {event.startTime} - {event.endTime}
                    </Text>
                    <Text>{event.description}</Text>
                    <Text>{event.location}</Text>
                    <Text>카테고리: {event.category}</Text>
                    {event.repeat?.type !== 'none' && (
                      <Text>
                        반복: {event.repeat?.interval}
                        {event.repeat?.type === 'daily' && '일'}
                        {event.repeat?.type === 'weekly' && '주'}
                        {event.repeat?.type === 'monthly' && '월'}
                        {event.repeat?.type === 'yearly' && '년'}
                        마다
                        {event.repeat?.endDate &&
                          ` (종료: ${event.repeat?.endDate})`}
                      </Text>
                    )}
                    <Text>
                      알림:{' '}
                      {
                        notificationOptions.find(
                          (option) => option.value === event.notificationTime
                        )?.label
                      }
                    </Text>
                  </VStack>
                  <HStack>
                    <IconButton
                      aria-label="Edit event"
                      icon={<EditIcon />}
                      onClick={() => editEvent(event)}
                    />
                    <IconButton
                      aria-label="Delete event"
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteEvent(event.id)}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      </Flex>

      <AlertDialog
        isOpen={isOverlapDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOverlapDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
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
              <Button
                ref={cancelRef}
                onClick={() => setIsOverlapDialogOpen(false)}
              >
                취소
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  setIsOverlapDialogOpen(false);
                  handleSaveEvent(
                    createEventFromFormData(
                      formData,
                      editingEvent ? editingEvent.id : undefined
                    )
                  );
                }}
                ml={3}
              >
                계속 진행
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertBox
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </Box>
  );
}

export default App;
