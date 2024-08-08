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
} from '@chakra-ui/react';
import { CATEGORIES, NOTIFICATION_OPTION } from '../constants/constants';
import { EventFormState, useEventForm } from '../hooks/useEventForm';
import { ChangeEvent, useState } from 'react';
import { RepeatType } from '../types/types';

type Props = {
  isEditingEvent: boolean;
  handleAddOrUpdateEvent: () => Promise<void>;
  formData: EventFormState;
  setField: (
    field:
      | 'id'
      | 'title'
      | 'date'
      | 'startTime'
      | 'endTime'
      | 'description'
      | 'location'
      | 'category'
      | 'repeat'
      | 'notificationTime'
      | 'isRepeating'
      | 'errors',
    value: any
  ) => void;
  validateTime: (
    start: string,
    end: string
  ) => {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
  validateDate: (
    startDate: string,
    endDate: string
  ) => {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    endDate?: string;
  };
  isException: boolean;
  setIsException: React.Dispatch<React.SetStateAction<boolean>>;
};

const EventForm = ({
  isEditingEvent,
  handleAddOrUpdateEvent,
  formData,
  setField,
  validateTime,
  validateDate,
  isException,
  setIsException,
}: Props) => {
  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setField('startTime', newStartTime);
    validateTime(newStartTime, formData.endTime);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setField('endTime', newEndTime);
    validateTime(formData.startTime, newEndTime);
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setField('repeat', { ...formData.repeat, endDate: newEndDate });
    validateDate(formData.repeat?.endDate || '', newEndDate);
  };

  return (
    <VStack w='400px' spacing={5} align='stretch'>
      <Heading>{isEditingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={formData.title} onChange={(e) => setField('title', e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input type='date' value={formData.date} onChange={(e) => setField('date', e.target.value)} />
      </FormControl>

      <HStack width='100%'>
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip label={formData.errors?.startTime} isOpen={!!formData.errors?.startTime} placement='top'>
            <Input
              type='time'
              value={formData.startTime}
              onChange={handleStartTimeChange}
              onBlur={() => validateTime(formData.startTime, formData.endTime)}
              isInvalid={!!formData.errors?.startTime}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={formData.errors?.endTime} isOpen={!!formData.errors?.endTime} placement='top'>
            <Input
              type='time'
              value={formData.endTime}
              onChange={handleEndTimeChange}
              onBlur={() => validateTime(formData.startTime, formData.endTime)}
              isInvalid={!!formData.errors?.endTime}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input value={formData.description} onChange={(e) => setField('description', e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input value={formData.location} onChange={(e) => setField('location', e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select value={formData.category} onChange={(e) => setField('category', e.target.value)}>
          <option value=''>카테고리 선택</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={formData.notificationTime}
          onChange={(e) => setField('notificationTime', Number(e.target.value))}>
          {NOTIFICATION_OPTION.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox isChecked={formData.isRepeating} onChange={(e) => setField('isRepeating', e.target.checked)}>
          반복 일정
        </Checkbox>
      </FormControl>

      {formData.isRepeating && (
        <VStack width='100%'>
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={formData.repeat?.type}
              onChange={(e) => setField('repeat', { ...formData.repeat, type: e.target.value as RepeatType })}>
              <option value='none'>반복 안함</option>
              <option value='daily'>매일</option>
              <option value='weekly'>매주</option>
              <option value='monthly'>매월</option>
              <option value='yearly'>매년</option>
            </Select>
          </FormControl>
          {formData.repeat?.type !== 'none' && (
            <HStack width='100%'>
              <FormControl>
                <FormLabel>반복 간격</FormLabel>
                <Input
                  type='number'
                  value={formData.repeat?.interval}
                  onChange={(e) => setField('repeat', { ...formData.repeat, interval: Number(e.target.value) })}
                  min={1}
                />
              </FormControl>
              <FormControl>
                <FormLabel>반복 종료일</FormLabel>
                <Tooltip label={formData.errors?.endDate} isOpen={!!formData.errors?.endDate} placement='top'>
                  <Input
                    type='date'
                    value={formData.repeat?.endDate}
                    onChange={handleEndDateChange}
                    onBlur={() => validateDate(formData.date, formData.repeat?.endDate || '')}
                    isInvalid={!!formData.errors?.endDate}
                  />
                </Tooltip>
              </FormControl>
            </HStack>
          )}
        </VStack>
      )}
      {formData.isRepeating && isEditingEvent && (
        <FormControl>
          <FormLabel>반복 예외 수정</FormLabel>
          <Checkbox isChecked={isException} onChange={(e) => setIsException(e.target.checked)}>
            예외 일정
          </Checkbox>
        </FormControl>
      )}

      <Button data-testid='event-submit-button' onClick={handleAddOrUpdateEvent} colorScheme='blue'>
        {isEditingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
};

export default EventForm;
