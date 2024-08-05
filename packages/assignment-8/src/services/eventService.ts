import { Event } from '../types';
import { handleResponse } from './api';

const API_BASE_URL = '/api';

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Event[]>(response);
}

export async function createEvent(event: Omit<Event, 'id'>) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  return handleResponse<Event>(response);
}

export async function updateEvent(event: Event) {
  const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  return handleResponse<Event>(response);
}

export async function deleteEvent(id: number) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return await handleResponse<void>(response);
}

export async function fetchHolidays(year: number, month: number) {
  const response = await fetch(`${API_BASE_URL}/holidays?year=${year}&month=${month}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Record<string, string>>(response);
}