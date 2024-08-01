import { Event } from '../types';
import { fetchFromAPI } from './api';

export async function fetchEvents(): Promise<Event[]> {
  return fetchFromAPI<Event[]>('/events');
}

export async function createEvent(event: Omit<Event, 'id'>): Promise<Event> {
  return fetchFromAPI<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

export async function updateEvent(event: Event): Promise<Event> {
  return fetchFromAPI<Event>(`/events/${event.id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(id: number): Promise<void> {
  await fetchFromAPI(`/events/${id}`, { method: 'DELETE' });
}

export async function fetchHolidays(
  year: number,
  month: number
): Promise<Record<string, string>> {
  return fetchFromAPI<Record<string, string>>(
    `/holidays?year=${year}&month=${month}`
  );
}
