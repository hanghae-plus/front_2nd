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
import { ChangeEvent, FC } from "react";
import { Event, RepeatType } from "../../type/schedule.type";
import { notificationOptions } from "../../dateUtils";

const categories = ["업무", "개인", "가족", "기타"];

interface Props {
  form: {
    title: string;
    setTitle: (title: string) => void;
    date: string;
    setDate: (date: string) => void;
    startTime: string;
    setStartTime: (startTime: string) => void;
    endTime: string;
    setEndTime: (endTime: string) => void;
    description: string;
    setDescription: (description: string) => void;
    location: string;
    setLocation: (location: string) => void;
    category: string;
    setCategory: (category: string) => void;
    isRepeating: boolean;
    setIsRepeating: (isRepeating: boolean) => void;
    repeatType: RepeatType;
    setRepeatType: (repeatType: RepeatType) => void;
    repeatInterval: number;
    setRepeatInterval: (repeatInterval: number) => void;
    repeatEndDate: string;
    setRepeatEndDate: (repeatEndDate: string) => void;
  };
  editingEvent: Event | null;
  startTimeError: string | null;
  handleStartTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  validateTime: (start: string, end: string) => void;

  endTimeError: string | null;
  handleEndTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;

  notificationTime: number;
  setNotificationTime: (notificationTime: number) => void;

  addOrUpdateEvent: () => void;
}

const EventForm: FC<Props> = ({
  form,
  editingEvent,
  startTimeError,
  handleStartTimeChange,
  validateTime,
  endTimeError,
  handleEndTimeChange,
  notificationTime,
  setNotificationTime,
  addOrUpdateEvent,
}) => {
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
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
  } = form;

  const clickIsRepeat = () => {
    if (isRepeating) {
      setIsRepeating(false);
      setRepeatType("none");
      setRepeatInterval(1);
      setRepeatEndDate("");
      return;
    }
    setIsRepeating(true);
    setRepeatType("daily");
    return;
  };

  return (
    <VStack w="400px" spacing={5} align="stretch">
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
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
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
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        <Checkbox isChecked={isRepeating} onChange={clickIsRepeat}>
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
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
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
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

      <Button
        data-testid="event-submit-button"
        onClick={addOrUpdateEvent}
        colorScheme="blue"
      >
        {editingEvent ? "일정 수정" : "일정 추가"}
      </Button>
    </VStack>
  );
};

export default EventForm;
