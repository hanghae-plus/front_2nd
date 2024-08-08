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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSchedulerContext } from '../contexts/SchedulerContext';
import { findOverlappingEvents } from '../utils/event';
import { EVENT_CATEGORIES, NOTIFICATION_OPTIONS } from '../constants';
import { EventFormData } from '../types';
import { useForm } from '../hooks/useForm';
import { useEffect } from 'react';

function EventForm() {
  const {
    events,
    overlapDialog,
    error,
    loading,
    setTempEventData,
    selectedEvent,
    clearSelectedEvent,
  } = useSchedulerContext();
  const { saveEvent } = events;

  const {
    event,
    errors,
    setEvent,
    handleInputChange,
    handleCheckboxChange,
    validateForm,
    validateTime,
  } = useForm();

  useEffect(() => {
    if (selectedEvent) {
      setEvent(selectedEvent as EventFormData);
    }
  }, [selectedEvent, setEvent]);

  const handleSubmit = async (eventData: EventFormData) => {
    if (validateForm()) {
      const overlapping = findOverlappingEvents(eventData, events.events);
      if (overlapping.length > 0) {
        setTempEventData(eventData);
        overlapDialog.openDialog(overlapping);
      } else {
        await saveEvent(eventData);
        clearSelectedEvent();
      }
    }
  };

  return (
    <VStack w='400px' spacing={5} align='stretch'>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          name='title'
          value={event.title || ''}
          data-cy='input-title'
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type='date'
          name='date'
          data-cy='input-date'
          value={event.date || ''}
          onChange={handleInputChange}
        />
      </FormControl>

      <HStack width='100%'>
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip
            label={errors.startTime}
            isOpen={!!errors.startTime}
            placement='top'
          >
            <Input
              type='time'
              name='startTime'
              data-cy='input-startTime'
              value={event.startTime || ''}
              onChange={handleInputChange}
              onBlur={() =>
                validateTime(event.startTime || '', event.endTime || '')
              }
              isInvalid={!!errors.startTime}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip
            label={errors.endTime}
            isOpen={!!errors.endTime}
            placement='top'
          >
            <Input
              type='time'
              name='endTime'
              data-cy='input-endTime'
              value={event.endTime || ''}
              onChange={handleInputChange}
              onBlur={() =>
                validateTime(event.startTime || '', event.endTime || '')
              }
              isInvalid={!!errors.endTime}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          name='description'
          data-cy='input-description'
          value={event.description || ''}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          name='location'
          data-cy='input-location'
          value={event.location || ''}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          name='category'
          data-cy='input-category'
          value={event.category || ''}
          onChange={handleInputChange}
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
          name='repeat.isRepeating'
          isChecked={event.repeat.isRepeating}
          onChange={handleCheckboxChange}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      {event.repeat.isRepeating && (
        <VStack width='100%'>
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              name='repeat.type'
              value={event.repeat.type}
              onChange={handleInputChange}
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
                name='repeat.interval'
                value={event.repeat.interval}
                onChange={handleInputChange}
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type='date'
                name='repeat.endDate'
                value={event.repeat?.endDate || ''}
                onChange={handleInputChange}
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
          onChange={handleInputChange}
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
        onClick={() => handleSubmit(event)}
        colorScheme='blue'
        isLoading={loading.isLoading}
        isDisabled={loading.isLoading}
      >
        {event.id ? '일정 수정' : '일정 추가'}
      </Button>

      {error.error && (
        <Alert status='error'>
          <AlertIcon />
          {error.error}
        </Alert>
      )}
    </VStack>
  );
}

export default EventForm;
