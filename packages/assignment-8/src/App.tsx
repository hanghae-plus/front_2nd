import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { BellIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { formatDate, formatMonth, formatWeek, getEventsForDay, getWeekDates, getWeeksAtMonth } from "./utils/dateUtils";
import { Event, RepeatType } from "./types";
import { getTimeErrorMessage } from "./utils/timeValidation";
import { findOverlappingEvents } from "./utils/eventOverlap";
import { useEventForm } from "./hooks/useEventForm.ts";
import { useEventOperations } from "./hooks/useEventOperations.ts";
import { useNotifications } from "./hooks/useNotifications.ts";
import { useCalendarView } from "./hooks/useCalendarView.ts";
import { useSearch } from "./hooks/useSearch.ts";

const categories = ['업무', '개인', '가족', '기타'];

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

function App() {
  const {
    title, setTitle,
    date, setDate,
    startTime, endTime,
    description, setDescription,
    location, setLocation,
    category, setCategory,
    isRepeating, setIsRepeating,
    repeatType, setRepeatType,
    repeatInterval, setRepeatInterval,
    repeatEndDate, setRepeatEndDate,
    notificationTime, setNotificationTime,
    startTimeError, endTimeError,
    editingEvent, setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, fetchEvents, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () => setEditingEvent(null));
  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm }  = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();

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
      title, date, startTime, endTime, description, location, category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    return (
      <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
        <Heading size="md">{formatWeek(currentDate)}</Heading>
        <Table variant="simple" w="full">
          <Thead>
            <Tr>
              {weekDays.map(day => (
                <Th key={day} width="14.28%">{day}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              {weekDates.map(date => (
                <Td key={date.toISOString()} height="100px" verticalAlign="top" width="14.28%">
                  <Text fontWeight="bold">{date.getDate()}</Text>
                  {filteredEvents
                    .filter(event => new Date(event.date).toDateString() === date.toDateString())
                    .map(event => {
                      const isNotified = notifiedEvents.includes(event.id);
                      const isRepeatEvent = event.repeat.type !== 'none' && event.repeat.interval > 0
                      return (
                        <Box
                          key={`${event.id}-${event.subId}`}
                          p={1}
                          my={1}
                          bg={isNotified ? "red.100" : "gray.100"}
                          borderRadius="md"
                          fontWeight={isNotified ? "bold" : "normal"}
                          color={isNotified ? "red.500" : "inherit"}
                        >
                          <HStack spacing={1}>
                            {isNotified && <BellIcon/>}
                            <Text fontSize="sm" noOfLines={1}>{isRepeatEvent ? '🔄' : ''}{event.title}</Text>
                          </HStack>
                        </Box>
                      )
                    })
                  }
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    );
  };

  const renderMonthView = () => {
    const weeks = getWeeksAtMonth(currentDate);

    return (
      <VStack data-testid="month-view" align="stretch" w="full" spacing={4}>
        <Heading size="md">{formatMonth(currentDate)}</Heading>
        <Table variant="simple" w="full">
          <Thead>
            <Tr>
              {weekDays.map(day => (
                <Th key={day} width="14.28%">{day}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {weeks.map((week, weekIndex) => (
              <Tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];
                  return (
                    <Td data-cy={`month-view-cell-${currentDate.getMonth() + 1}-${day}`} key={dayIndex} height="100px" verticalAlign="top" width="14.28%" position="relative">
                      {day && (
                        <>
                          <Text fontWeight="bold">{day}</Text>
                          {holiday && (<Text color="red.500" fontSize="sm">{holiday}</Text>)}
                          {getEventsForDay(filteredEvents, day).map(event => {
                            const isNotified = notifiedEvents.includes(event.id);
                            const isRepeatEvent = event.repeat.type !== 'none' && event.repeat.interval > 0
                            return (
                              <Box
                                key={`${event.id}-${event.subId}`}
                                p={1}
                                my={1}
                                bg={isNotified ? "red.100" : "gray.100"}
                                borderRadius="md"
                                fontWeight={isNotified ? "bold" : "normal"}
                                color={isNotified ? "red.500" : "inherit"}
                              >
                                <HStack spacing={1}>
                                  {isNotified && <BellIcon/>}
                                  <Text fontSize="sm" noOfLines={1}>{isRepeatEvent ? '🔄' : ''}{event.title}</Text>
                                </HStack>
                              </Box>
                            );
                          })}
                        </>
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    );
  };

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <VStack w="400px" spacing={5} align="stretch">
          <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input data-cy='input-title' value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>날짜</FormLabel>
            <Input data-cy='input-date' type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
          </FormControl>

          <HStack width="100%">
            <FormControl>
              <FormLabel>시작 시간</FormLabel>
              <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
                <Input
                data-cy='input-start-time'
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  onBlur={() => getTimeErrorMessage(startTime, endTime)}
                  isInvalid={!!startTimeError}
                />
              </Tooltip>
            </FormControl>
            <FormControl>
              <FormLabel>종료 시간</FormLabel>
              <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
                <Input
                data-cy='input-end-time'
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  onBlur={() => getTimeErrorMessage(startTime, endTime)}
                  isInvalid={!!endTimeError}
                />
              </Tooltip>
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>설명</FormLabel>
            <Input data-cy="input-description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>위치</FormLabel>
            <Input data-cy="input-location" value={location} onChange={(e) => setLocation(e.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <Select data-cy="input-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>반복 설정</FormLabel>
            <Checkbox role="repeatCheckbox" isChecked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)}>
              반복 일정
            </Checkbox>
          </FormControl>

          <FormControl>
            <FormLabel>알림 설정</FormLabel>
            <Select
              value={notificationTime}
              onChange={(e) => setNotificationTime(Number(e.target.value))}
            >
              {notificationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {isRepeating && (
            <VStack width="100%">
              <FormControl>
                <FormLabel>반복 유형</FormLabel>
                <Select value={repeatType} onChange={(e) => setRepeatType(e.target.value as RepeatType)}>
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
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>반복 종료일</FormLabel>
                  <Input
                    type="date"
                    value={repeatEndDate}
                    onChange={(e) => setRepeatEndDate(e.target.value)}
                  />
                </FormControl>
              </HStack>
            </VStack>
          )}

          <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
            {editingEvent ? '일정 수정' : '일정 추가'}
          </Button>
        </VStack>

        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon/>}
              onClick={() => navigate('prev')}
            />
            <Select aria-label="view" value={view} onChange={(e) => setView(e.target.value as 'week' | 'month')}>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon/>}
              onClick={() => navigate('next')}
            />
          </HStack>

          {view === 'week' && renderWeekView()}
          {view === 'month' && renderMonthView()}
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
          ) : filteredEvents.map((event) => (
            <Box key={`${event.id}-${event.subId}`} data-testid={`event-item-${event.id}-${event.subId}`} borderWidth={1} borderRadius="lg" p={3} width="100%">
              <HStack justifyContent="space-between">
                <VStack align="start">
                  <HStack>
                    {notifiedEvents.includes(event.id) && <BellIcon color="red.500"/>}
                    <Text fontWeight={notifiedEvents.includes(event.id) ? "bold" : "normal"}
                          color={notifiedEvents.includes(event.id) ? "red.500" : "inherit"}>
                      {event.title}
                    </Text>
                  </HStack>
                  <Text>{event.date} {event.startTime} - {event.endTime}</Text>
                  <Text>{event.description}</Text>
                  <Text>{event.location}</Text>
                  <Text>카테고리: {event.category}</Text>
                  {event.repeat.type !== 'none' && (
                    <Text>
                      반복: {event.repeat.interval}
                      {event.repeat.type === 'daily' && '일'}
                      {event.repeat.type === 'weekly' && '주'}
                      {event.repeat.type === 'monthly' && '월'}
                      {event.repeat.type === 'yearly' && '년'}
                      마다
                      {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
                    </Text>
                  )}
                  <Text>알림: {notificationOptions.find(option => option.value === event.notificationTime)?.label}</Text>
                </VStack>
                <HStack>
                  <IconButton
                  data-cy="event-edit-button"
                    aria-label="Edit event"
                    icon={<EditIcon/>}
                    onClick={() => editEvent(event)}
                  />
                  <IconButton
                  data-cy="event-delete-button"
                    aria-label="Delete event"
                    icon={<DeleteIcon/>}
                    onClick={() => deleteEvent(event.id)}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Flex>

      <AlertDialog
        isOpen={isOverlapDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOverlapDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent data-cy="alert">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              일정 겹침 경고
            </AlertDialogHeader>

            <AlertDialogBody>
              다음 일정과 겹칩니다:
              {overlappingEvents.map(event => (
                <Text key={`${event.id}-${event.subId}`}>{event.title} ({event.date} {event.startTime}-{event.endTime})</Text>
              ))}
              계속 진행하시겠습니까?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button data-cy="alert-cancel-button" ref={cancelRef} onClick={() => setIsOverlapDialogOpen(false)}>
                취소
              </Button>
              <Button colorScheme="red" onClick={() => {
                setIsOverlapDialogOpen(false);
                saveEvent({
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
                });
              }} ml={3}>
                계속 진행
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {notifications.length > 0 && <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
        {notifications.map((notification, index) => (
          <Alert key={index} status="info" variant="solid" width="auto">
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

export default App;
