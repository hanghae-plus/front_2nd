import { create } from "zustand";
import { Event } from "../types";

type State = {
  events: Event[];
  notifiedEvents: number[];
  overlappingEvents: Event[];

  isEventEdit: boolean;
  isEventDeleted: boolean;
  editingEvent: Event | null;
};

type Action = {
  setEvents: (events: Event[] | ((prev: Event[]) => Event[])) => void;
  setNotifiedEvents: (
    notifiedEvents: number[] | ((prev: number[]) => number[])
  ) => void;
  setOverlappingEvents: (
    overlappingEvents: Event[] | ((prev: Event[]) => Event[])
  ) => void;

  setIsEventEdit: (isEditEvent: boolean) => void;
  setIsEventDeleted: (isEventDelted: boolean) => void;
  setEditingEvent: (editingEvent: Event | null) => void;
};
export const eventsStore = create<State & Action>((set) => ({
  events: [],
  notifiedEvents: [],
  overlappingEvents: [],

  isEventEdit: false,
  isEventDeleted: false,
  editingEvent: null,

  setEvents: (updater) =>
    set((state) => ({
      events: typeof updater === "function" ? updater(state.events) : updater,
    })),
  setNotifiedEvents: (updater) =>
    set((state) => ({
      notifiedEvents:
        typeof updater === "function" ? updater(state.notifiedEvents) : updater,
    })),
  setOverlappingEvents: (updater) =>
    set((state) => ({
      overlappingEvents:
        typeof updater === "function"
          ? updater(state.overlappingEvents)
          : updater,
    })),

  setIsEventEdit: (isEventEdit) => set({ isEventEdit }),
  setIsEventDeleted: (isEventDeleted) => set({ isEventDeleted }),
  setEditingEvent: (editingEvent) => set({ editingEvent }),
}));
