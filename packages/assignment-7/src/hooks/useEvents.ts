import { useState, useCallback } from 'react';
import * as eventService from '../services/eventService';
import { Event, EventFormData } from '../types';
import { convertFormDataToEvent } from '../utils/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedEvents = await eventService.fetchEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (newEventData: EventFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = convertFormDataToEvent(newEventData);
      const createdEvent = await eventService.createEvent(newEvent);
      setEvents((prev) => [...prev, createdEvent]);
    } catch (err) {
      setError('Failed to add event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (updatedEventData: EventFormData) => {
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
  }, []);

  const deleteEvent = useCallback(async (eventId: number) => {
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
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
