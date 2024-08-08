import { ChangeEvent, useState } from "react";
import { Event, RepeatType, RepeatChild } from "../types";
import { validateTime } from "../utils/validationTools";

export const useEventForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>("none");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [children, setChildren] = useState<RepeatChild[]>([]);
  const [notificationTime, setNotificationTime] = useState(10);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    const { startTimeError } = validateTime(newStartTime, endTime);
    setStartTimeError(startTimeError);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    const { endTimeError } = validateTime(startTime, newEndTime);
    setEndTimeError(endTimeError);
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setLocation("");
    setCategory("");
    setIsRepeating(false);
    setRepeatType("none");
    setRepeatInterval(1);
    setRepeatEndDate("");
    setChildren([]);
    setNotificationTime(10);
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setLocation(event.location);
    setCategory(event.category);
    setIsRepeating(event.repeat.type !== "none");
    setRepeatType(event.repeat.type);
    setRepeatInterval(event.repeat.interval);
    setRepeatEndDate(event.repeat.endDate || "");
    setChildren(event.repeat.children || []);
    setNotificationTime(event.notificationTime);
  };

  return {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    children,
    setChildren,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  };
};
