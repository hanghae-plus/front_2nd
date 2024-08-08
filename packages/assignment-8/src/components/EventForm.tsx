import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Tooltip,
  Select,
  Checkbox,
  Button,
  useToast,
} from "@chakra-ui/react";
import { categories, notificationOptions } from "../magicnumbers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Event, RepeatType } from "../types";
import AlertModal from "./AlertModal";
import useEventForm from "../hooks/useEventForm";

interface Props {
  events: Event[];
  fetchEvents: () => Promise<void>;
  editingEvent: Event | null;
  setEditingEvent: Dispatch<SetStateAction<Event | null>>;
}

const EventForm = ({
  events,
  fetchEvents,
  editingEvent,
  setEditingEvent,
}: Props) => {
  const {
    eventFormData,
    validate,
    validateTime,
    startTimeError,
    endTimeError,
    getOverlappingEvents,
    setupForEditEvent,
    handleChange,
    saveEvent,
  } = useEventForm(editingEvent ? true : false);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (editingEvent) {
      setupForEditEvent(editingEvent);
    }
  }, [editingEvent]);

  const addOrUpdateEvent = async () => {
    try {
      validate();
    } catch (error) {
      toast({
        title: String(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const overlapping = getOverlappingEvents(events);
    if (overlapping) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      saveEvent()
        .then(async () => {
          await fetchEvents();

          toast({
            title: `일정이 ${editingEvent ? "수정" : "추가"}되었습니다.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((error: Error) => {
          console.error("Error saving event:", error);

          toast({
            title: "일정 저장 실패",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
      setEditingEvent(null);
    }
  };

  return (
    <VStack w='400px' spacing={5} align='stretch'>
      <Heading>{editingEvent ? "일정 수정" : "일정 추가"}</Heading>

      <FormControl>
        <FormLabel htmlFor='title-input'>제목</FormLabel>
        <Input
          id='title-input'
          value={eventFormData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor='date-input'>날짜</FormLabel>
        <Input
          id='date-input'
          type='date'
          value={eventFormData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </FormControl>

      <HStack width='100%'>
        <FormControl>
          <FormLabel htmlFor='start-time-input'>시작 시간</FormLabel>
          <Tooltip
            label={startTimeError}
            isOpen={!!startTimeError}
            placement='top'
          >
            <Input
              id='start-time-input'
              type='time'
              value={eventFormData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              onBlur={() =>
                validateTime(eventFormData.startTime, eventFormData.endTime)
              }
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='end-time-input'>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement='top'>
            <Input
              id='end-time-input'
              type='time'
              value={eventFormData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              onBlur={() =>
                validateTime(eventFormData.startTime, eventFormData.endTime)
              }
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={eventFormData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={eventFormData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={eventFormData.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value=''>카테고리 선택</option>
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
          isChecked={eventFormData.isRepeating}
          onChange={(e) => handleChange("isRepeating", e.target.checked)}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={eventFormData.notificationTime}
          onChange={(e) =>
            handleChange("notificationTime", Number(e.target.value))
          }
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {eventFormData.isRepeating && (
        <VStack width='100%'>
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={eventFormData.repeatType}
              onChange={(e) =>
                handleChange("repeatType", e.target.value as RepeatType)
              }
            >
              <option value='daily'>매일</option>
              <option value='weekly'>매주</option>
              <option value='monthly'>매월</option>
              <option value='yearly'>매년</option>
            </Select>
          </FormControl>
          <HStack width='100%'>
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type='number'
                value={eventFormData.repeatInterval}
                onChange={(e) =>
                  handleChange("repeatInterval", Number(e.target.value))
                }
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type='date'
                value={eventFormData.repeatEndDate}
                onChange={(e) => handleChange("repeatEndDate", e.target.value)}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <Button
        data-testid='event-submit-button'
        onClick={addOrUpdateEvent}
        colorScheme='blue'
      >
        {editingEvent ? "일정 수정" : "일정 추가"}
      </Button>

      <AlertModal
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        saveEvent={saveEvent}
        fetchEvents={fetchEvents}
      />
    </VStack>
  );
};

export default EventForm;
