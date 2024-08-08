import { useReducer, useCallback, useEffect, useState } from 'react';
import { Event } from '../types/types';
import { useToast } from '@chakra-ui/react';
import { findOverlappingEvents } from '../utils/eventUtils';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

// 여러개의 state값을 관리하기 쉽게 하기 위해 useReducer를 사용!

export type EventFormState = Omit<Event, 'id' | 'repeatId'> & {
  id?: number | null;
  repeatId?: string | null;
  isRepeating: boolean;
  errors: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    endDate?: string;
  };
};

type EventFormAction =
  | { type: 'SET_FIELD'; field: keyof EventFormState; value: any }
  | { type: 'RESET' }
  | { type: 'SET_ALL'; event: Event }
  | { type: 'SET_ERRORS'; errors: EventFormState['errors'] };

//초기값
const initialState: EventFormState = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  isRepeating: false,
  repeat: { type: 'none', interval: 1, endDate: '' },
  notificationTime: 10,
  errors: {},
};

//이벤트 폼 리듀서
function eventFormReducer(state: EventFormState, action: EventFormAction): EventFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialState;
    case 'SET_ALL':
      return { ...action.event, isRepeating: action.event.repeat?.type !== 'none', errors: {} };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    default:
      return state;
  }
}

export const useEventForm = (existingEvents: Event[]) => {
  const [state, dispatch] = useReducer(eventFormReducer, initialState);
  const [isException, setIsException] = useState<boolean>(false);

  const toast = useToast();

  useEffect(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setField = useCallback((field: keyof EventFormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setFormData = useCallback((event: Event) => {
    dispatch({ type: 'SET_ALL', event });
  }, []);

  const validateTime = useCallback((start: string, end: string) => {
    const errors: EventFormState['errors'] = {};
    if (!start || !end) return errors;

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      errors.startTime = '시작 시간은 종료 시간보다 빨라야 합니다.';
      errors.endTime = '종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    dispatch({ type: 'SET_ERRORS', errors });
    return errors;
  }, []);

  const validateDate = useCallback((startDate: string, endDate: string) => {
    //repeat의 endDate가 date보다 빠른 날짜라면 에러를 반환한다.
    const errors: EventFormState['errors'] = {};
    if (!startDate || !endDate) return errors;

    if (new Date(startDate) >= new Date(endDate)) {
      errors.endDate = '종료일은 시작일보다 늦어야 합니다.';
    }

    dispatch({ type: 'SET_ERRORS', errors });
    return errors;
  }, []);

  const addOrUpdateEvent = useCallback(
    async (updateMode: boolean = false) => {
      const {
        title,
        date,
        startTime,
        endTime,
        description,
        location,
        category,
        isRepeating,
        repeat,
        notificationTime,
      } = state;

      if (!title || !date || !startTime || !endTime) {
        toast({
          title: '필수 정보를 모두 입력해주세요.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return { success: false };
      }

      const timeErrors = validateTime(startTime, endTime);
      if (Object.keys(timeErrors).length > 0) {
        toast({
          title: '시간 설정을 확인해주세요.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return { success: false };
      }

      const eventData: Event = {
        id: state.id || Date.now(),
        repeatId: null,
        title,
        date,
        startTime,
        endTime,
        description,
        location,
        category,
        repeat: {
          type: isRepeating ? repeat.type : 'none',
          interval: repeat?.interval,
          endDate: repeat?.endDate || undefined,
        },
        notificationTime,
      };

      const overlapping = findOverlappingEvents(eventData, existingEvents);
      if (overlapping.length > 0) {
        if (eventData.repeat.type !== 'none' && !updateMode) {
          const repeatedEvents = generateRepeatedEvents(eventData);
          return { success: false, overlappingEvents: overlapping, eventData: repeatedEvents };
        } else {
          return { success: false, overlappingEvents: overlapping, eventData };
        }
      } else {
        if (eventData.repeat.type !== 'none' && !updateMode) {
          const repeatedEvents = generateRepeatedEvents(eventData);
          return { success: true, eventData: repeatedEvents };
        } else {
          return { success: true, eventData };
        }
      }
    },
    [state, validateTime, toast]
  );

  const generateRepeatedEvents = (event: Event): Event[] => {
    const events: Event[] = [event];
    const startDate = new Date(event.date);
    const endDate = event.repeat.endDate ? new Date(event.repeat.endDate) : addYears(startDate, 1); // 기본적으로 1년 동안 반복

    let currentDate = startDate;

    while (currentDate <= endDate) {
      switch (event.repeat.type) {
        case 'daily':
          currentDate = addDays(currentDate, event.repeat.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, event.repeat.interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, event.repeat.interval);
          break;
        case 'yearly':
          currentDate = addYears(currentDate, event.repeat.interval);
          break;
      }

      if (currentDate <= endDate) {
        events.push({
          ...event,
          id: Date.now() + events.length, // 새로운
          date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
        });
      }
    }

    return events;
  };

  return {
    formData: state,
    isException,
    setIsException,
    setField,
    resetForm,
    setFormData,
    addOrUpdateEvent,
    validateTime,
    validateDate,
    generateRepeatedEvents,
  };
};
