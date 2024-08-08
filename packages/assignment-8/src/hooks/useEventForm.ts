import { useState, useEffect } from "react";
import { Event, EventFormLabel, RepeatType } from "../types";
import { findOverlappingEvents } from "../utils";

const initialEventFormData = {
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
  notificationTime: 10,
};

const useEventForm = (isEditing: boolean = false) => {
  const [eventFormData, setEventFormData] = useState(initialEventFormData);
  const [eventData, setEventData] = useState<Partial<Event>>({});

  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    setEventData((prev) => {
      return {
        id: prev.id || Date.now(),
        title: eventFormData.title,
        date: eventFormData.date,
        startTime: eventFormData.startTime,
        endTime: eventFormData.endTime,
        description: eventFormData.description,
        location: eventFormData.location,
        category: eventFormData.category,
        repeat: {
          type: eventFormData.repeatType,
          interval: eventFormData.repeatInterval,
          endDate: eventFormData.repeatEndDate,
        },
        notificationTime: eventFormData.notificationTime,
      };
    });
  }, [eventFormData]);

  const handleChange = (
    label: keyof EventFormLabel,
    value: string | number | boolean
  ) => {
    setEventFormData((prev) => {
      const newValue: { [key: string]: string | number | boolean } = {};
      newValue[label] = value;

      // 반복 설정 추가 시 기본 반복 주기는 매일, 삭제 시 none
      if(label === 'isRepeating') { 
        newValue['repeatType'] = value ? 'daily' : 'none';
      }

      return { ...prev, ...newValue };
    });
  };

  const resetForm = () => {
    setEventFormData(initialEventFormData);
    setEventData({});
  };

  const setupForEditEvent = (event: Partial<Event>) => {
    setEventFormData({
      title: event.title || "",
      date: event.date || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      description: event.description || "",
      location: event.location || "",
      category: event.category || "",
      isRepeating: event.repeat?.type !== "none" || false,
      repeatType: event.repeat?.type || "none",
      repeatInterval: event.repeat?.interval || 1,
      repeatEndDate: event.repeat?.endDate || "",
      notificationTime: event.notificationTime || 10,
    });

    setEventData(event);
  };

  const validateRequired = () => {
    return (
      eventFormData.title &&
      eventFormData.date &&
      eventFormData.startTime &&
      eventFormData.endTime
    );
  };

  const validateTime = (start: string, end: string) => {
    if (!start || !end) return;

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      setStartTimeError("시작 시간은 종료 시간보다 빨라야 합니다.");
      setEndTimeError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return false;
    } else {
      setStartTimeError(null);
      setEndTimeError(null);
      return true;
    }
  };

  const validate = () => {
    if (!validateRequired()) {
      throw "필수 정보를 모두 입력해주세요.";
    }
    if (!validateTime(eventFormData.startTime, eventFormData.endTime)) {
      throw "시간 설정을 확인해주세요.";
    }
  };

  const getOverlappingEvents = (events: Event[]) => {
    const overlapping = findOverlappingEvents(events, eventData as Event);
    return overlapping.length > 0 ? overlapping : null;
  };

  const saveEvent = async () => {
    try {
      let response;
      if (isEditing) {
        // id값은 값의 변경을 확실하게 막기 위해 제거
        // date값이 포함될경우 원본 파일의 시작일이 변경될 수 있어 제거
        const updatedEvent = {...eventData};
        updatedEvent['id'] = undefined;
        updatedEvent['date'] = undefined;

        response = await fetch(`/api/events/${eventData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...eventData, id: Date.now() }),
        });
      }
      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      throw error;
    }
  };

  return {
    eventFormData,
    validate,
    validateTime,
    startTimeError,
    endTimeError,
    getOverlappingEvents,
    setupForEditEvent,
    handleChange,
    saveEvent,
  };
};

export default useEventForm;
