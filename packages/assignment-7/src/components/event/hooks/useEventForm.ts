import { ChangeEvent, useEffect, useState } from "react";
import { Event, RepeatType } from "../../../App";

export const useEventForm = (editingEvent: Event | null) => {
  const [eventFormValue, setEventFormValue] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    category: "",
    isRepeating: false,
    repeatType: "none" as RepeatType,
    repeatInterval: 1,
    repeatEndDate: "",
    notificationTime: 0,
  });

  // formValidation
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const validateTime = (start: string, end: string) => {
    if (!start || !end) return;

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      setStartTimeError("시작 시간은 종료 시간보다 빨라야 합니다.");
      setEndTimeError("종료 시간은 시작 시간보다 늦어야 합니다.");
    } else {
      setStartTimeError(null);
      setEndTimeError(null);
    }
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setEventFormValue((prevValue) => {
      const newValue = { ...prevValue, startTime: newStartTime };
      validateTime(newStartTime, newValue.endTime);
      return newValue;
    });
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEventFormValue((prevValue) => {
      const newValue = { ...prevValue, endTime: newEndTime };
      validateTime(newValue.startTime, newEndTime);
      return newValue;
    });
  };

  /**
   * form 초기화 함수
   */
  const resetForm = () => {
    setEventFormValue({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      category: "",
      isRepeating: false,
      repeatType: "none",
      repeatInterval: 1,
      repeatEndDate: "",
      notificationTime: 10,
    });
  };

  useEffect(() => {
    if (editingEvent) {
      setEventFormValue({
        title: editingEvent.title || "",
        date: editingEvent.date || "",
        startTime: editingEvent.startTime || "",
        endTime: editingEvent.endTime || "",
        description: editingEvent.description || "",
        location: editingEvent.location || "",
        category: editingEvent.category || "",
        isRepeating: editingEvent.repeat?.type !== "none",
        repeatType: editingEvent.repeat?.type || "none",
        repeatInterval: editingEvent.repeat?.interval || 1,
        repeatEndDate: editingEvent.repeat?.endDate || "",
        notificationTime: editingEvent.notificationTime || 10,
      });
    } else {
      resetForm();
    }
  }, [editingEvent]);

  return {
    eventFormValue,
    setEventFormValue,
    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,
    validateTime,
    resetForm,
  };
};
