import { useEffect, useState } from 'react';
import { Event } from '../types';
import { useToast } from '@chakra-ui/react';

export const useEventOperations = (editing: boolean, onSave?: () => void) => {
  const [events, setEvents] = useState<Event[]>([]);
  const toast = useToast();

  const generateRepeatingEvents = (event: Event) => {
    const { date, repeat, ...rest } = event;
    const { type, interval } = repeat;
    let events: Event[] = [];

    if (repeat && type !== 'none') {
      const startDate = new Date(date);
      const endDate = new Date(repeat.endDate!);
      let currentDate = new Date(startDate.getTime());
      console.log({ currentDate });

      while (currentDate <= endDate) {
        events.push({
          ...rest,
          repeat,
          date: currentDate.toISOString().split('T')[0],
        });

        switch (type) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + interval);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7 * interval);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + interval);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + interval);
            break;
          default:
            break;
        }
      }
    } else {
      events.push(event);
    }

    return events;
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      const allEvents = data.flatMap(generateRepeatingEvents);
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const saveEvent = async (eventData: Event) => {
    try {
      let response;
      if (editing) {
        response = await fetch(`/api/events/${eventData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      await fetchEvents();
      onSave?.();
      toast({
        title: editing ? '일정이 수정되었습니다.' : '일정이 추가되었습니다.',
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
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchEvents();
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

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, fetchEvents, saveEvent, deleteEvent };
};
