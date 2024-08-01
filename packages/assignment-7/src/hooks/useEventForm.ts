import { useReducer, useCallback, useEffect } from 'react';
import { Event } from '../types/types';
import { useToast } from '@chakra-ui/react';
import { findOverlappingEvents } from '../utils/eventUtils';

// 여러개의 state값을 관리하기 쉽게 하기 위해 useReducer를 사용!

export type EventFormState = Omit<Event, 'id'> & {
  id?: number;
  isRepeating: boolean;
  errors: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
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

  const addOrUpdateEvent = useCallback(async () => {
    const { title, date, startTime, endTime, description, location, category, isRepeating, repeat, notificationTime } =
      state;

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
      return { success: false, overlappingEvents: overlapping, eventData };
    } else {
      return { success: true, eventData };
    }
  }, [state, validateTime, toast]);

  return {
    formData: state,
    setField,
    resetForm,
    setFormData,
    addOrUpdateEvent,
    validateTime,
  };
};
