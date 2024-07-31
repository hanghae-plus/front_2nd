// src/hooks/useEventManagement.js
import { useState } from 'react';

export function useEventManagement() {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  const removeEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return {
    events,
    addEvent,
    removeEvent,
  };
}
