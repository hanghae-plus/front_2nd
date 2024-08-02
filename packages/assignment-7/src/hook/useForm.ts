import {Event, RepeatType} from "../types/types.ts";
import {ChangeEvent, useState} from "react";
import useValidateTime from "./useValidateTime.ts";

const useForm = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isRepeating, setIsRepeating] = useState(false);
    const [repeatType, setRepeatType] = useState<RepeatType>('none');
    const [repeatInterval, setRepeatInterval] = useState(1);
    const [repeatEndDate, setRepeatEndDate] = useState('');
    const [notificationTime, setNotificationTime] = useState(10);
    const {
        startTimeError,
        endTimeError,
        setStartTimeError,
        setEndTimeError,
        validateTime,
    } = useValidateTime()

    // 폼데이터 초기화
    const resetForm = () => {
        setTitle('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setDescription('');
        setLocation('');
        setCategory('');
        setEditingEvent(null);
        setIsRepeating(false);
        setRepeatType('none');
        setRepeatInterval(1);
        setRepeatEndDate('');
    };

    // 폼데이터 수정
    const editEvent = (event: Event) => {
        setEditingEvent(event);
        setTitle(event.title);
        setDate(event.date);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setDescription(event.description);
        setLocation(event.location);
        setCategory(event.category);
        setIsRepeating(event.repeat.type !== 'none');
        setRepeatType(event.repeat.type);
        setRepeatInterval(event.repeat.interval);
        setRepeatEndDate(event.repeat.endDate || '');
        setNotificationTime(event.notificationTime);
    };

    // 시작시간 변경
    const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newStartTime = e.target.value;
        setStartTime(newStartTime);
        validateTime(newStartTime, endTime);
    };

    // 종료시간 변경
    const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newEndTime = e.target.value;
        setEndTime(newEndTime);
        validateTime(startTime, newEndTime);
    };

    return{
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
        editingEvent,
        setEditingEvent,
        isRepeating,
        setIsRepeating,
        repeatType,
        setRepeatType,
        repeatInterval,
        setRepeatInterval,
        repeatEndDate,
        setRepeatEndDate,
        notificationTime,
        setNotificationTime,
        resetForm,
        editEvent,
        handleStartTimeChange,
        handleEndTimeChange,
        startTimeError,
        endTimeError,
        setStartTimeError,
        setEndTimeError,
        validateTime
    }
}


export default useForm;