import { useState } from 'react';
import * as eventService from '../services/eventService';
import { Event, EventFormData } from '../types';
import {
  convertFormDataToEvent,
  generateRecurringEvents,
} from '../utils/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedEvents = await eventService.fetchEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (newEventData: EventFormData) => {
    setLoading(true);
    setError(null);
    try {
      if (newEventData.repeat.isRepeating) {
        // 반복 일정 생성
        const recurringEvents = generateRecurringEvents(
          {
            ...newEventData,
            id: Date.now(), // 임시 ID 부여
            repeat: {
              type: newEventData.repeat.type,
              interval: newEventData.repeat.interval,
              endDate: newEventData.repeat.endDate,
            },
          } as Event,
          new Date(newEventData.repeat.endDate || '9999-12-31')
        );

        // 각 반복 일정을 서버에 저장하고 ID를 부여받음
        const savedEvents = await Promise.all(
          recurringEvents.map((event) => eventService.createEvent(event))
        );

        // 상태 업데이트
        setEvents((prevEvents) => [...prevEvents, ...savedEvents]);
      } else {
        // 단일 일정 추가
        const savedEvent = await eventService.createEvent(newEventData);
        setEvents((prevEvents) => [...prevEvents, savedEvent]);
      }
    } catch (err) {
      setError('Failed to add event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (updatedEventData: EventFormData) => {
    if (!updatedEventData.id) {
      setError('Cannot update event without id');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = convertFormDataToEvent(updatedEventData);
      const updated = await eventService.updateEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((event) => (event.id === updated.id ? updated : event))
      );
    } catch (err) {
      setError('Failed to update event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: number) => {
    setLoading(true);
    setError(null);
    try {
      await eventService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveEvent = async (eventData: EventFormData) => {
    setLoading(true);
    try {
      if (eventData.id) {
        await updateEvent(eventData);
      } else {
        await addEvent(eventData);
      }
      return {
        success: true,
        message: `일정이 ${eventData.id ? '수정' : '추가'}되었습니다.`,
      };
    } catch (err) {
      return { success: false, error: '일정 저장 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    setEvents,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    saveEvent,
  };
}
