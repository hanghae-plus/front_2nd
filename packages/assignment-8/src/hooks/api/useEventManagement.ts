// hooks/useEventManagement.ts
import { useState } from 'react';
import {
  createRecurringEvents,
  getOneYearLaterDate,
} from '../../utils/dateUtils';
import useChakraToast from '../useChakraToast';
import { Event } from '../../interface';

export function useEventManagement(fetchEvents: () => Promise<void>) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { successToast, errorToast, infoToast } = useChakraToast();

  const saveEvent = async (eventData: Event) => {
    try {
      if (editingEvent) {
        await updateEvent(eventData);
      } else {
        await createEvent(eventData);
      }

      await fetchEvents();
      setEditingEvent(null);
      successToast(
        editingEvent ? '일정이 수정되었습니다.' : '일정이 추가되었습니다.'
      );
    } catch (error) {
      console.error('Error saving event:', error);
      errorToast('일정 저장 실패');
    }
  };

  const updateEvent = async (eventData: Event) => {
    const response = await fetch(`/api/events/${eventData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to update event');
  };

  const createEvent = async (eventData: Event) => {
    if (eventData.repeat?.type !== 'none') {
      await createRecurringEvent(eventData);
    } else {
      await createSingleEvent(eventData);
    }
  };

  const createRecurringEvent = async (eventData: Event) => {
    const endDate =
      eventData.repeat?.endDate || getOneYearLaterDate(eventData.date);
    const recurringEvents = createRecurringEvents(eventData, endDate);

    for (const event of recurringEvents) {
      await createSingleEvent(event);
    }
  };

  const createSingleEvent = async (event: Event) => {
    const response = await fetch(`/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to save event');
  };

  const deleteEvent = async (id: number) => {
    try {
      await deleteEventRequest(id);
      await fetchEvents();
      infoToast('일정이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting event:', error);
      errorToast('일정 삭제 실패');
    }
  };

  const deleteEventRequest = async (id: number) => {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  };

  return {
    editingEvent,
    setEditingEvent,
    saveEvent,
    deleteEvent,
  };
}
