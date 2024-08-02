import { useState } from 'react';
import { Event, EventFormData, RepeatType } from '../types';

interface FormErrors {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export function useForm(initialEvent?: EventFormData) {
  const createForm = () => {
    const form = {
      id: undefined,
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      category: '개인',
      location: '',
      repeat: { type: 'none' as const, interval: 1 },
      notificationTime: 0,
      isRepeating: false,
      repeatType: 'none' as const,
      repeatInterval: 1,
      repeatEndDate: '',
    } as EventFormData;

    return form;
  };

  const [event, setEvent] = useState<EventFormData>(initialEvent || createForm());
  const [errors, setErrors] = useState<FormErrors>({});

  const validateTime = (start: string, end: string) => {
    if (!start || !end) return;

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      setErrors((prev) => ({
        ...prev,
        startTime: '시작 시간은 종료 시간보다 빨라야 합니다.',
        endTime: '종료 시간은 시작 시간보다 늦어야 합니다.',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        startTime: undefined,
        endTime: undefined,
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));

    if (name === 'startTime' || name === 'endTime') {
      validateTime(
        name === 'startTime' ? value : event.startTime || '',
        name === 'endTime' ? value : event.endTime || ''
      );
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'isRepeating') {
      setEvent((prev) => ({
        ...prev,
        repeat: {
          type: checked ? ('daily' as RepeatType) : ('none' as RepeatType),
          interval: 1,
        },
      }));
    } else {
      setEvent((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!event.title) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!event.date) {
      newErrors.date = '날짜를 선택해주세요.';
    }

    if (!event.startTime) {
      newErrors.startTime = '시작 시간을 선택해주세요.';
    }

    if (!event.endTime) {
      newErrors.endTime = '종료 시간을 선택해주세요.';
    }

    if (event.startTime && event.endTime) {
      const start = new Date(`2000-01-01T${event.startTime}`);
      const end = new Date(`2000-01-01T${event.endTime}`);
      if (start >= end) {
        newErrors.startTime = '시작 시간은 종료 시간보다 빨라야 합니다.';
        newErrors.endTime = '종료 시간은 시작 시간보다 늦어야 합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setEvent(createForm());
    setErrors({});
  };

  const editEvent = (eventToEdit: Event) => {
    setEvent({
      ...eventToEdit,
      isRepeating: eventToEdit.repeat.type !== 'none',
    });
  };

  return {
    event,
    setEvent,
    errors,
    handleInputChange,
    handleCheckboxChange,
    validateForm,
    resetForm,
    validateTime,
    editEvent,
  };
}
