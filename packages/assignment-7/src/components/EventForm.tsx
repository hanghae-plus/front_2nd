import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Button,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { EventFormData } from '../types';
import { EVENT_CATEGORIES, NOTIFICATION_OPTIONS } from '../constants';

interface EventFormProps {
  event: EventFormData;
  onSubmit: (event: EventFormData) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startTimeError?: string;
  endTimeError?: string;
  validateTime: (start: string, end: string) => void;
}

function EventForm({
  event,
  onSubmit,
  onInputChange,
  onCheckboxChange,
  startTimeError,
  endTimeError,
  validateTime,
}: EventFormProps) {
  return (
    <VStack w='400px' spacing={5} align='stretch'>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          name='title'
          value={event.title || ''}
          onChange={onInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type='date'
          name='date'
          value={event.date || ''}
          onChange={onInputChange}
        />
      </FormControl>

      <HStack width='100%'>
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip
            label={startTimeError}
            isOpen={!!startTimeError}
            placement='top'
          >
            <Input
              type='time'
              name='startTime'
              value={event.startTime || ''}
              onChange={onInputChange}
              onBlur={() =>
                validateTime(event.startTime || '', event.endTime || '')
              }
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement='top'>
            <Input
              type='time'
              name='endTime'
              value={event.endTime || ''}
              onChange={onInputChange}
              onBlur={() =>
                validateTime(event.startTime || '', event.endTime || '')
              }
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          name='description'
          value={event.description || ''}
          onChange={onInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          name='location'
          value={event.location || ''}
          onChange={onInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          name='category'
          value={event.category || ''}
          onChange={onInputChange}
        >
          <option value=''>카테고리 선택</option>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox
          name='isRepeating'
          isChecked={event.repeat?.type !== 'none'}
          onChange={onCheckboxChange}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      {event.repeat?.type !== 'none' && (
        <VStack width='100%'>
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              name='repeatType'
              value={event.repeat?.type}
              onChange={onInputChange}
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
                name='repeatInterval'
                value={event.repeat?.interval}
                onChange={onInputChange}
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type='date'
                name='repeatEndDate'
                value={event.repeat?.endDate || ''}
                onChange={onInputChange}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          name='notificationTime'
          value={event.notificationTime}
          onChange={onInputChange}
        >
          {NOTIFICATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button
        data-testid='event-submit-button'
        onClick={() => onSubmit(event)}
        colorScheme='blue'
      >
        {event.id ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
}

export default EventForm;
