import { useToast } from "@chakra-ui/react";
import { ChangeEvent, FC, useState } from "react";
import { Event, RepeatType } from "../type/schedule.type";
import { isOverlapping } from "../dateUtils";

interface Props {
  fetchEvents: () => void;
  events: Event[];
}

const useForm = ({ fetchEvents, events }: Props) => {
  const toast = useToast();

  // 일정추가
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
  const [notificationTime, setNotificationTime] = useState(10);

  // 일정 수정 내 수정 내용
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // 일정 추가 내 시작 끝 경고
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

  // 일정 겹침 alert 경고
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setLocation("");
    setCategory("");
    setEditingEvent(null);
    setIsRepeating(false);
    setRepeatType("none");
    setRepeatInterval(1);
    setRepeatEndDate("");
  };

  const saveEvent = async (eventData: Event) => {
    try {
      let response;
      if (editingEvent) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      setEditingEvent(null);
      resetForm();
      toast({
        title: editingEvent
          ? "일정이 수정되었습니다."
          : "일정이 추가되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "일정 저장 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: "필수 정보를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    validateTime(startTime, endTime);
    if (startTimeError || endTimeError) {
      toast({
        title: "시간 설정을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : "none",
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
    }
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    validateTime(newStartTime, endTime);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    validateTime(startTime, newEndTime);
  };

  // 겹치는 일정을 찾는 함수
  const findOverlappingEvents = (newEvent: Event): Event[] => {
    return events.filter(
      (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
    );
  };

  return {
    editingEvent,

    title,
    setTitle,
    date,
    setDate,
    startTimeError,
    startTime,
    handleStartTimeChange,
    validateTime,
    endTime,
    endTimeError,
    handleEndTimeChange,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    addOrUpdateEvent,
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappingEvents,
    saveEvent,
    notificationTime,
    setIsRepeating,
    setNotificationTime,
    setEditingEvent,
    setStartTime,
    setEndTime,
  };
};

export default useForm;
