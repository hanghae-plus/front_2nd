import { ChangeEvent, Dispatch, SetStateAction } from "react";
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

import { Event, RepeatType } from "../../types";

import { validateTime } from "../../utils/validationTools";
import {
  CATEGORIES,
  NOTIFICATION_OPTIONS,
  REPEAT_OPTIONS,
} from "../../constants";

interface Props {
  editingEvent: Event | null;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  startTimeError: string | null;
  startTime: string;
  handleStartTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  endTime: string;
  endTimeError: string | null;
  handleEndTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  isRepeating: boolean;
  setIsRepeating: Dispatch<SetStateAction<boolean>>;
  notificationTime: number;
  setNotificationTime: Dispatch<SetStateAction<number>>;
  repeatType: RepeatType;
  setRepeatType: Dispatch<SetStateAction<RepeatType>>;
  repeatInterval: number;
  setRepeatInterval: Dispatch<SetStateAction<number>>;
  repeatEndDate: string;
  setRepeatEndDate: Dispatch<SetStateAction<string>>;
  addOrUpdateEvent: () => void;
}

const EventAddOrUpdate = ({
  editingEvent,
  title,
  setTitle,
  date,
  setDate,
  startTimeError,
  startTime,
  handleStartTimeChange,
  endTime,
  endTimeError,
  handleEndTimeChange,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
  isRepeating,
  setIsRepeating,
  notificationTime,
  setNotificationTime,
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
  addOrUpdateEvent,
}: Props) => {
  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? "일정 수정" : "일정 추가"}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          data-testid="title-input"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          data-testid="date-input"
          required
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
              data-testid="start-time-input"
              required
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
              data-testid="end-time-input"
              required
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
          data-testid="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          data-testid="location-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          data-testid="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">카테고리 선택</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
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
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as RepeatType)}
            >
              {REPEAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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

export default EventAddOrUpdate;
