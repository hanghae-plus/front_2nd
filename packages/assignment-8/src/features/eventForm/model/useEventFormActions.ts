import { useState, useCallback } from 'react';
import {
  type EventFormState,
  type EventFormContextType,
} from './EventFormContext';
import { validateTime } from './eventFormUtils';

export const useEventFormActions = () => {
  const [state, setState] = useState<EventFormState>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '',
    isRecurring: false,
    notificationTime: 10,
    recurringType: '매일',
    recurringInterval: 1,
    recurringEndDate: '',
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
  });

  const updateField: EventFormContextType['updateField'] = useCallback(
    (field, value) => {
      setState((prevState) => {
        const newState = { ...prevState, [field]: value };
        return newState;
      });
    },
    []
  );

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const validateAndUpdateErrors = useCallback((start: string, end: string) => {
    const validateData = validateTime({ start, end });
    if (validateData.isValid) {
      setStartTimeError(null);
      setEndTimeError(null);
    } else {
      setStartTimeError(validateData.startTimeError);
      setEndTimeError(validateData.endTimeError);
    }
  }, []);

  const handleStartTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStartTime = e.target.value;
      setStartTime(newStartTime);
      updateField('startTime', newStartTime);
      validateAndUpdateErrors(newStartTime, endTime);
    },
    [endTime, updateField, validateAndUpdateErrors]
  );

  const handleEndTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEndTime = e.target.value;
      setEndTime(newEndTime);
      updateField('endTime', newEndTime);
      validateAndUpdateErrors(startTime, newEndTime);
    },
    [startTime, updateField, validateAndUpdateErrors]
  );

  const [isRepeating, setIsRepeating] = useState(false);

  return {
    state,
    updateField,
    startTime,
    endTime,
    startTimeError,
    endTimeError,
    isRepeating,
    setIsRepeating,
    handleStartTimeChange,
    handleEndTimeChange,
  };
};
