import { categories, notificationOptions } from "@/contants";
import useEventForm from "@/hooks/useEventForm";
import { RepeatType } from "@/types";
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
  VStack,
} from "@chakra-ui/react";

interface Props {
  addOrUpdateEvent: () => Promise<void>;
  eventForm: ReturnType<typeof useEventForm>;
}
const EventForm = ({ addOrUpdateEvent, eventForm }: Props) => {
  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{eventForm.editingEvent ? "일정 수정" : "일정 추가"}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={eventForm.title}
          onChange={(e) => eventForm.setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          value={eventForm.date}
          onChange={(e) => eventForm.setDate(e.target.value)}
        />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip
            label={eventForm.startTimeError}
            isOpen={!!eventForm.startTimeError}
            placement="top"
          >
            <Input
              type="time"
              value={eventForm.startTime}
              onChange={eventForm.handleStartTimeChange}
              onBlur={eventForm.onBlurTimeInput}
              isInvalid={!!eventForm.startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip
            label={eventForm.endTimeError}
            isOpen={!!eventForm.endTimeError}
            placement="top"
          >
            <Input
              type="time"
              value={eventForm.endTime}
              onChange={eventForm.handleEndTimeChange}
              onBlur={eventForm.onBlurTimeInput}
              isInvalid={!!eventForm.endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={eventForm.description}
          onChange={(e) => eventForm.setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={eventForm.location}
          onChange={(e) => eventForm.setLocation(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={eventForm.category}
          onChange={(e) => eventForm.setCategory(e.target.value)}
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
          isChecked={eventForm.isRepeating}
          onChange={(e) => eventForm.setIsRepeating(e.target.checked)}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={eventForm.notificationTime}
          onChange={(e) =>
            eventForm.setNotificationTime(Number(e.target.value))
          }
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {eventForm.isRepeating && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={eventForm.repeatType}
              onChange={(e) =>
                eventForm.setRepeatType(e.target.value as RepeatType)
              }
            >
              <option value="none">반복없음</option>
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
                value={eventForm.repeatInterval}
                onChange={(e) =>
                  eventForm.setRepeatInterval(Number(e.target.value))
                }
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={eventForm.repeatEndDate}
                onChange={(e) => eventForm.setRepeatEndDate(e.target.value)}
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
        {eventForm.editingEvent ? "일정 수정" : "일정 추가"}
      </Button>
    </VStack>
  );
};

export default EventForm;
