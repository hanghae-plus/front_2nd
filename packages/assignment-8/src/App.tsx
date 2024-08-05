import { useEffect, useState } from "react";
import {
  Alert,
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
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";

import useNotifiedEvents from "./hooks/useNotifiedEvents";
import useGetEvents from "./hooks/useGetEvents";
import { EventType, RepeatType } from "./types/event";
import MonthCalendar from "./components/MonthCalendar";
import useGetFilteredEvents from "./hooks/useGetFilteredEvents";
import WeekCalendar from "./components/WeekCalendar";
import {
  notificationOptions,
  repeatOptions,
  categories,
} from "./shared/constants";
import { useEventForm } from "./hooks/useEventForm";
import { findOverlappingEvents } from "./utils/overlapping";
import useDeleteEvents from "./hooks/useDeleteEvent";
import OverlappingAlertDialog from "./components/OverlappingAlertDialog";

function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    resetForm,
    editEvent,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
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
    editingEvent,
    setEditingEvent,
    startTimeError,
    endTimeError,
    validateTime,
    handleEndTimeChange,
    handleStartTimeChange,
  } = useEventForm();

  const [events, setEvents] = useState<EventType[] | undefined>([]);
  const [view, setView] = useState<"week" | "month">("month");
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<EventType[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast();

  const { events: updatedEvents, fetchEvents } = useGetEvents();

  const { deleteEvent } = useDeleteEvents();
  const { notifications, notifiedEvents, filterNotifications } =
    useNotifiedEvents({
      events,
      now: currentDate,
    });

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

    const eventData: EventType = {
      id: editingEvent ? editingEvent.id : Date.now(),
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: repeatType,
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(events as EventType[], eventData);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
    }
  };

  const saveEvent = async (eventData: EventType) => {
    try {
      let response;
      if (editingEvent) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      const data = await fetchEvents(); // 이벤트 목록 새로고침
      setEvents(data);

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
        title: editingEvent ? "일정 수정 실패" : "일정 저장 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  const saveOverlappingEvent = () => {
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
        type: repeatType,
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    });
  };

  const { filteredEvents } = useGetFilteredEvents({
    events,
    searchTerm,
    currentDate,
    view,
  });

  useEffect(() => {
    setEvents(updatedEvents);
  }, [updatedEvents]);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <VStack w="400px" spacing={5} align="stretch" role="form">
          <Heading>{editingEvent ? "일정 수정" : "일정 추가"}</Heading>

          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>날짜</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
                  value={startTime}
                  onChange={handleStartTimeChange}
                  onBlur={() => validateTime(startTime, endTime)}
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
                  value={endTime}
                  onChange={handleEndTimeChange}
                  onBlur={() => validateTime(startTime, endTime)}
                  isInvalid={!!endTimeError}
                />
              </Tooltip>
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>설명</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>위치</FormLabel>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              isChecked={isRepeating}
              onChange={(e) => setIsRepeating(e.target.checked)}
            >
              반복 일정
            </Checkbox>
          </FormControl>

          <FormControl>
            <FormLabel>알림 설정</FormLabel>
            <Select
              name="notificationTime"
              value={notificationTime}
              onChange={(e) => setNotificationTime(Number(e.target.value))}
            >
              {notificationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {isRepeating && (
            <>
              <FormControl>
                <FormLabel>반복 유형</FormLabel>
                <Select
                  name="repeatType"
                  value={repeatType}
                  onChange={(e) => setRepeatType(e.target.value as RepeatType)}
                >
                  {repeatOptions.map(({ value, name }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>반복 간격</FormLabel>
                <Input
                  name="repeatInterval"
                  type="number"
                  value={repeatInterval}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setRepeatInterval(value);
                  }}
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
            </>
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
              data-testid="calendar-view-select"
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

          {view === "week" && (
            <WeekCalendar
              currentDate={currentDate}
              searchTerm={searchTerm}
              events={events}
            />
          )}
          {view === "month" && (
            <MonthCalendar
              events={events}
              currentDate={currentDate}
              searchTerm={searchTerm}
              repeatEvent={
                isRepeating
                  ? {
                      date,
                      repeatType,
                      repeatInterval,
                      repeatEndDate,
                    }
                  : null
              }
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

          {filteredEvents?.length === 0 ? (
            <Text>검색 결과가 없습니다.</Text>
          ) : (
            filteredEvents?.map((event) => (
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
                        data-testid={event.title}
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
                    {event.repeat.type && (
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
                      data-testid="edit-event-button"
                    />
                    <IconButton
                      aria-label="Delete event"
                      icon={<DeleteIcon />}
                      onClick={async () => {
                        const data = await deleteEvent(event.id);
                        setEvents(data);
                      }}
                      data-testid="delete-event-button"
                    />
                  </HStack>
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      </Flex>

      <OverlappingAlertDialog
        isOpen={isOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        onClose={() => setIsOverlapDialogOpen(false)}
        onContinue={saveOverlappingEvent}
      />

      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
            <Alert key={index} status="info" variant="solid" width="auto">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
              </Box>
              <CloseButton onClick={() => filterNotifications(index)} />
            </Alert>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default App;
