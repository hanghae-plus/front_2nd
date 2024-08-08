import { useState, useCallback } from 'react';
import useChakraToast from '../useChakraToast';
import { Event } from '../../interface';

export function useEvents(fetchEventsFunction?: () => Promise<Event[]>) {
  const [events, setEvents] = useState<Event[]>([]);
  const { errorToast } = useChakraToast();

  const fetchEvents = useCallback(async () => {
    try {
      let data: Event[];
      if (fetchEventsFunction) {
        data = await fetchEventsFunction();
      } else {
        const response = await fetch(`/api/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        data = await response.json();
      }
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      errorToast('이벤트 로딩 실패');
    }
  }, [fetchEventsFunction, errorToast]);

  return { events, fetchEvents };
}
