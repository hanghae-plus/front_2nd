// hooks/useEvents.ts
import { useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { Event, ViewType } from '../types';
import { findOverlappingEvents, getWeekDates } from '../utils';
import useEventForm from './useEventForm';
import useFetchEvents from './useFetchEvents';
import useNotification from './useNotificaiton';

function useEvents() {
  const formState = useEventForm();
  const { events, fetchEvents } = useFetchEvents();
  const toast = useToast();
  const notificationsState = useNotification(events);

  const [view, setView] = useState<ViewType>('month');
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const cancelRef = useRef<HTMLButtonElement>(null);

  const saveEvent = async (eventData: Event) => {
    try {
      let response;
      if (formState.editingEvent) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      formState.setEditingEvent(null);
      formState.resetForm();
      toast({
        title: formState.editingEvent
          ? '일정이 수정되었습니다.'
          : '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: '일정 저장 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      toast({
        title: '일정이 삭제되었습니다.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addOrUpdateEvent = async () => {
    const {
      title,
      date,
      startTime,
      endTime,
      startTimeError,
      endTimeError,
      validateTime,
    } = formState;

    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    validateTime(startTime, endTime);
    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event = {
      id: formState.editingEvent ? formState.editingEvent.id : Date.now(),
      title,
      date,
      startTime,
      endTime,
      description: formState.description,
      location: formState.location,
      category: formState.category,
      repeat: {
        type: formState.isRepeating ? formState.repeatType : 'none',
        interval: formState.repeatInterval,
        endDate: formState.repeatEndDate || undefined,
      },
      notificationTime: formState.notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
    }
  };

  const searchEvents = (term: string) => {
    if (!term.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredEvents = (() => {
    const filtered = searchEvents(searchTerm);
    return filtered.filter((event) => {
      const eventDate = new Date(event.date);
      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === 'month') {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
      return true;
    });
  })();

  return {
    formState,
    notificationsState,
    viewState: { view, setView },
    dialogState: {
      isOverlapDialogOpen,
      setIsOverlapDialogOpen,
      overlappingEvents,
      setOverlappingEvents,
    },
    currentDateState: { currentDate, setCurrentDate },
    searchState: { searchTerm, setSearchTerm },
    cancelRef,
    saveEvent,
    deleteEvent,
    addOrUpdateEvent,
    filteredEvents,
  };
}

export default useEvents;
