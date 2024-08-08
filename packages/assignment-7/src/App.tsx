import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
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
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  useInterval,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FormCheckbox } from "./components/molecules/FormCheckbox";
import { FormField } from "./components/molecules/FormField";
import { FormSelect } from "./components/molecules/FormSelect";
import { MonthlyCalendar } from "./components/organisms/MonthlyCalendar";
import { WeeklyCalendar } from "./components/organisms/WeeklyCalendar";
import { useEvents } from "./hooks/useEvents";
import { useFilteredEvents } from "./hooks/useFilteredEvents";
import { REPEAT_TYPE_SELECTS, RepeatType } from "./constants/date";

interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

const categories = ["업무", "개인", "가족", "기타"];

export const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const notificationOptions = [
  { value: 1, label: "1분 전" },
  { value: 10, label: "10분 전" },
  { value: 60, label: "1시간 전" },
  { value: 120, label: "2시간 전" },
  { value: 1440, label: "1일 전" },
];

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
    "2024-12-25": "크리스마스",
  };
};

function App() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [view, setView] = useState<"week" | "month">("month");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>("none");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [notificationTime, setNotificationTime] = useState(10);
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState("");
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

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
        type: isRepeating ? repeatType : "none",
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
      if (editingEvent) {
        await updateEvent(eventData);
      } else {
        await addEvent(eventData);
      }

      setEditingEvent(null);
      resetForm();
      toast({
        title: editingEvent
          ? "일정이 수정되었습니다."
          : "일정이 추가되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "일정 저장 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      toast({
        title: "일정이 삭제되었습니다.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
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
    const upcomingEvents = events.filter((event) => {
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
        console.error("Error updating notification status:", error);
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

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    validateTime(newStartTime, endTime);
  };

  const handleEndTimeChange = (newEndTime: string) => {
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
    return events.filter(
      (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
    );
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setLocation("");
    setCategory("");
    setEditingEvent(null);
    setIsRepeating(false);
    setRepeatType("none");
    setRepeatInterval(1);
    setRepeatEndDate("");
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
    setIsRepeating(event.repeat.type !== "none");
    setRepeatType(event.repeat.type);
    setRepeatInterval(event.repeat.interval);
    setRepeatEndDate(event.repeat.endDate || "");
    setNotificationTime(event.notificationTime);
  };

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  const filteredEvents = useFilteredEvents({
    searchTerm,
    view,
    currentDate,
  });

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <VStack w="400px" spacing={5} align="stretch">
          <Heading>{editingEvent ? "일정 수정" : "일정 추가"}</Heading>

          <FormField
            label="제목"
            value={title}
            onChange={setTitle}
            type="text"
          />

          <FormField label="날짜" value={date} onChange={setDate} type="date" />

          <HStack width="100%">
            <FormField
              label="시작 시간"
              value={startTime}
              onChange={handleStartTimeChange}
              type="time"
            />
            <FormField
              label="종료 시간"
              value={endTime}
              onChange={handleEndTimeChange}
              type="time"
            />
          </HStack>

          <FormField
            label="설명"
            value={description}
            onChange={setDescription}
            type="text"
          />

          <FormField
            label="위치"
            value={location}
            onChange={setLocation}
            type="text"
          />

          <FormSelect
            value={category}
            onChange={setCategory}
            label="카테고리"
            placeholder="카테고리 선택"
            options={categories.map((cat) => ({
              value: cat,
              label: cat,
            }))}
          />

          <FormCheckbox
            label="반복 설정"
            isChecked={isRepeating}
            onChange={setIsRepeating}
            checkboxLabel="반복 일정"
          />

          <FormSelect
            label="알림 설정"
            value={notificationTime}
            onChange={setNotificationTime}
            placeholder="알림 설정"
            options={notificationOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />

          {isRepeating && (
            <VStack width="100%">
              <FormSelect
                value={repeatType}
                onChange={setRepeatType}
                label="반복 유형"
                placeholder="반복 유형 선택"
                options={REPEAT_TYPE_SELECTS.map(({ value, label }) => ({
                  value,
                  label,
                }))}
              />

              <HStack width="100%">
                <FormField
                  label="반복 간격"
                  value={repeatInterval}
                  onChange={setRepeatInterval}
                  type="number"
                />
                <FormField
                  label="반복 종료일"
                  value={repeatEndDate}
                  onChange={setRepeatEndDate}
                  type="date"
                />
              </HStack>
            </VStack>
          )}

          <Button
            data-testid="event-submit-button"
            onClick={addOrUpdateEvent}
            colorScheme="blue"
          >
            {editingEvent ? "일정 수정" : "일정 추가"}
          </Button>
        </VStack>

        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={() => navigate("prev")}
            />
            <Select
              aria-label="view"
              value={view}
              onChange={(e) => setView(e.target.value as "week" | "month")}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={() => navigate("next")}
            />
          </HStack>

          {/* {view === "week" && renderWeekView()} */}
          {view === "week" && (
            <WeeklyCalendar
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
            />
          )}
          {view === "month" && (
            <MonthlyCalendar
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              holidays={holidays}
            />
          )}
        </VStack>

        <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
          <FormField
            placeholder="검색어를 입력하세요"
            label="일정 검색"
            value={searchTerm}
            onChange={setSearchTerm}
            type="text"
          />
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
                      {notifiedEvents.includes(event.id) && (
                        <BellIcon color="red.500" />
                      )}
                      <Text
                        fontWeight={
                          notifiedEvents.includes(event.id) ? "bold" : "normal"
                        }
                        color={
                          notifiedEvents.includes(event.id)
                            ? "red.500"
                            : "inherit"
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
                    {event.repeat.type !== "none" && (
                      <Text>
                        반복: {event.repeat.interval}
                        {event.repeat.type === "daily" && "일"}
                        {event.repeat.type === "weekly" && "주"}
                        {event.repeat.type === "monthly" && "월"}
                        {event.repeat.type === "yearly" && "년"}
                        마다
                        {event.repeat.endDate &&
                          ` (종료: ${event.repeat.endDate})`}
                      </Text>
                    )}
                    <Text>
                      알림:{" "}
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
                      type: isRepeating ? repeatType : "none",
                      interval: repeatInterval,
                      endDate: repeatEndDate || undefined,
                    },
                    notificationTime,
                  });
                }}
                ml={3}
              >
                계속 진행
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
            <Alert key={index} status="info" variant="solid" width="auto">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
              </Box>
              <CloseButton
                onClick={() =>
                  setNotifications((prev) => prev.filter((_, i) => i !== index))
                }
              />
            </Alert>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default App;
