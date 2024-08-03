import { useState } from "react";
import { Event } from "../type/schedule.type";

export const useEventForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [notificationTime, setNotificationTime] = useState(10);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setLocation("");
    setCategory("");
    setEditingEvent(null);
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
    notificationTime,
    setNotificationTime,
    editingEvent,
    setEditingEvent,
    resetForm,
  };
};
