import { create } from 'zustand';
import { Event } from './event.types';
import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';

type State = {
  currentEvent: Event;
};

type Action = {
  setCurrentEvent: (event: Event | null) => void;
  updateCurrentEvent: (updates: Partial<Event>) => void;
  clearCurrentEvent: () => void;
};

const defaultEvent: Event = {
  id: 0,
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  repeat: null,
  notificationTime: 0,
};

export const eventStore = create<State & Action>()(
  immer((set) => ({
    currentEvent: defaultEvent,

    setCurrentEvent: (event) =>
      set(() => ({ currentEvent: event || defaultEvent })),

    updateCurrentEvent: (updates) =>
      set(
        produce((state: State) => {
          Object.assign(state.currentEvent, updates);
        }),
      ),

    clearCurrentEvent: () =>
      set(
        produce((state: State) => {
          state.currentEvent = defaultEvent;
        }),
      ),
  })),
);
