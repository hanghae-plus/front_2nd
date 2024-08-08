import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Event, RepeatType } from "../types";
import { fetchEvents, saveEvent, updateEvent } from "../utils/api";
import { CATEGORIES, NOTIFICATION_OPTIONS } from "../const";
import { eventsStore } from "../store/eventsStore";
import { AlertMessageToast } from "./alertMessageToast";
import { useToasts } from "../hooks/useToasts.tsx";

export const EventForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>("none");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [notificationTime, setNotificationTime] = useState(10);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);

  const toast = useToast();
  const { getToastOptions } = useToasts();

  const {
    events,
    setEvents,
    setEditingEvent,
    editingEvent,
    isEventEdit,
    isEventDeleted,
    setIsEventEdit,
    setIsEventDeleted,
    setOverlappingEvents,
  } = eventsStore();

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

  const checkEventValue = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast(getToastOptions("requiredFieldsErrorToast"));
      return;
    }

    validateTime(startTime, endTime);
    if (startTimeError || endTimeError) {
      toast(getToastOptions("timeSettingErrorToast"));
      return;
    }

    const overlapping = findOverlappingEvents(eventData);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await handleUpdateEvent(eventData);
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

  const handleSetIsOverlapDialogOpen = (isOverlapDialogOpen: boolean) => {
    setIsOverlapDialogOpen(isOverlapDialogOpen);
  };

  const handleFetchEvents = async () => {
    try {
      const response = await fetchEvents();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Fetched data is not an array");
      }

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      toast(getToastOptions("loadingEventsFailToast"));
    }
  };

  const handleUpdateEvent = async (eventData: Event) => {
    let result;

    try {
      if (editingEvent) {
        result = await updateEvent(eventData);
      } else {
        result = await saveEvent(eventData);
      }

      await handleFetchEvents();
      setEditingEvent(null);
      resetForm();
      toast(
        getToastOptions(
          editingEvent ? "updatingEventSuccess" : "addingEventSuccess"
        )
      );
    } catch (error) {
      console.error("Error saving/updating event:", error);
      toast(getToastOptions("savingEventFail"));
    }
  };

  const fillInputsWithEditingEvent = (event: Event | null) => {
    if (!event) {
      resetForm();
      return;
    }
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

  const alertMessageToastProps = {
    isOverlapDialogOpen,
    handleSetIsOverlapDialogOpen,
    handleUpdateEvent,
    eventData,
  };

  useEffect(() => {
    handleFetchEvents();
  }, []);

  useEffect(() => {
    if (isEventDeleted) {
      handleFetchEvents();
      setIsEventDeleted(false);
    }
  }, [isEventDeleted]);

  useEffect(() => {
    fillInputsWithEditingEvent(editingEvent);
    setIsEventEdit(false);
  }, [isEventEdit, editingEvent]);

  return (
    <>
      <VStack w="400px" spacing={5} align="stretch">
        <Heading>{editingEvent ? "일정 수정" : "일정 추가"}</Heading>

        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            data-cy="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>날짜</FormLabel>
          <Input
            data-cy="date"
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
                data-cy="time"
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
                data-cy="time"
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
            data-cy="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>위치</FormLabel>
          <Input
            data-cy="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select
            data-cy="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">카테고리 선택</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>반복 설정</FormLabel>
          <Checkbox
            data-cy="repeat-check"
            role="repeatCheckbox"
            isChecked={isRepeating}
            onChange={(e) => {
              setIsRepeating(e.target.checked);
            }}
          >
            반복 일정
          </Checkbox>
        </FormControl>

        <FormControl>
          <FormLabel>알림 설정</FormLabel>
          <Select
            data-cy="notification-time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(Number(e.target.value))}
          >
            {NOTIFICATION_OPTIONS.map((option) => (
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
              <Select
                data-cy="repeat-type"
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value as RepeatType)}
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
                  data-cy="repeat-interval"
                  type="number"
                  value={repeatInterval}
                  onChange={(e) => setRepeatInterval(Number(e.target.value))}
                  min={1}
                />
              </FormControl>
              <FormControl>
                <FormLabel>반복 종료일</FormLabel>
                <Input
                  data-cy="repeat-end-date"
                  type="date"
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                />
              </FormControl>
            </HStack>
          </VStack>
        )}

        <Button
          data-testid="event-submit-button"
          onClick={checkEventValue}
          colorScheme="blue"
        >
          {editingEvent ? "일정 수정" : "일정 추가"}
        </Button>
      </VStack>

      <AlertMessageToast {...alertMessageToastProps} />
    </>
  );
};
