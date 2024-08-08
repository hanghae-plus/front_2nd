import {
  Heading,
  Button,
  FormControl,
  FormLabel,
  Tooltip,
  Input,
  HStack,
  Select,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import { type ReactNode } from 'react';
import {
  type EventFormContextType,
  type RepeatType,
} from '../model/EventFormContext';

import { validateTime } from '../model/eventFormUtils';

interface EventFormProps {
  children: ReactNode;
}

export const EventForm = ({ children }: EventFormProps): JSX.Element => {
  return <>{children}</>;
};

type HeaderProps = { isEditing: boolean };
EventForm.Header = ({ isEditing }: HeaderProps) => (
  <Heading>{isEditing ? '일정 수정' : '일정 추가'}</Heading>
);

type SubmitBtnProps = { isEditing: boolean; addOrUpdateEvent: () => void };
EventForm.SubmitBtn = ({ isEditing, addOrUpdateEvent }: SubmitBtnProps) => (
  <Button
    data-testid="event-submit-button"
    onClick={addOrUpdateEvent}
    colorScheme="blue"
  >
    {isEditing ? '일정 수정' : '일정 추가'}
  </Button>
);

type FormProps = EventFormContextType;
EventForm.Form = ({
  state,
  updateField,
  startTime,
  endTime,
  startTimeError,
  endTimeError,
  handleStartTimeChange,
  handleEndTimeChange,
  isRepeating,
  setIsRepeating,
}: FormProps) => {
  const categories = ['업무', '개인', '가족', '기타'];

  const notificationOptions = [
    { value: 1, label: '1분 전' },
    { value: 10, label: '10분 전' },
    { value: 60, label: '1시간 전' },
    { value: 120, label: '2시간 전' },
    { value: 1440, label: '1일 전' },
  ];
  return (
    <>
      {' '}
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={state.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          value={state.date}
          onChange={(e) => updateField('date', e.target.value)}
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
              value={state.startTime}
              onChange={handleStartTimeChange}
              onBlur={() =>
                validateTime({ start: startTime, end: endTime }).isValid
              }
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
            <Input
              type="time"
              value={state.endTime}
              onChange={handleEndTimeChange}
              onBlur={() =>
                validateTime({ start: startTime, end: endTime }).isValid
              }
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>
      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={state.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={state.location}
          onChange={(e) => updateField('location', e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={state.category}
          onChange={(e) => updateField('category', e.target.value)}
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
          value={state.notificationTime}
          onChange={(e) =>
            updateField('notificationTime', Number(e.target.value))
          }
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
              value={state.repeatType}
              onChange={(e) =>
                updateField('repeatType', e.target.value as RepeatType)
              }
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
                value={state.repeatInterval}
                onChange={(e) =>
                  updateField('recurringInterval', Number(e.target.value))
                }
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={state.repeatEndDate}
                onChange={(e) => updateField('repeatEndDate', e.target.value)}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}
    </>
  );
};
