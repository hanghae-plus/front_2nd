import { createContext, useContext, ReactNode, useState } from "react";
import { useCalendar } from "../hooks/useCalendar";
import { useEvents } from "../hooks/useEvents";
import { useNotifications } from "../hooks/useNotifications";
import { Event, EventFormData } from "../types";

type CalendarContextType = ReturnType<typeof useCalendar>;
type EventsContextType = ReturnType<typeof useEvents>;
type NotificationsContextType = ReturnType<typeof useNotifications>;

interface OverlapDialogState {
  isOpen: boolean;
  overlappingEvents: Event[];
}

interface ErrorState {
  error: string | null;
  setError: (error: string | null) => void;
}

interface LoadingState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

interface SchedulerContextType {
  calendar: CalendarContextType;
  events: EventsContextType;
  notifications: NotificationsContextType;
  overlapDialog: {
    state: OverlapDialogState;
    openDialog: (events: Event[]) => void;
    closeDialog: () => void;
  };
  error: ErrorState;
  loading: LoadingState;
  tempEventData: EventFormData | null;
  setTempEventData: (data: EventFormData | null) => void;
}

const SchedulerContext = createContext<SchedulerContextType | null>(null);

interface SchedulerProviderProps {
  children: ReactNode;
}

export function SchedulerProvider({ children }: SchedulerProviderProps) {
  const calendar = useCalendar();
  const events = useEvents();
  const notifications = useNotifications(events.events);

  const [overlapDialogState, setOverlapDialogState] =
    useState<OverlapDialogState>({ isOpen: false, overlappingEvents: [] });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempEventData, setTempEventData] = useState<EventFormData | null>(
    null
  );

  const contextValue: SchedulerContextType = {
    calendar,
    events,
    notifications,
    overlapDialog: {
      state: overlapDialogState,
      openDialog: (events) =>
        setOverlapDialogState({ isOpen: true, overlappingEvents: events }),
      closeDialog: () =>
        setOverlapDialogState({ isOpen: false, overlappingEvents: [] }),
    },
    error: {
      error,
      setError,
    },
    loading: {
      isLoading,
      setIsLoading,
    },
    tempEventData,
    setTempEventData,
  };

  return (
    <SchedulerContext.Provider value={contextValue}>
      {children}
    </SchedulerContext.Provider>
  );
}

export function useSchedulerContext(): SchedulerContextType {
  const context = useContext(SchedulerContext);
  if (context === null) {
    throw new Error(
      "useSchedulerContext must be used within a SchedulerProvider"
    );
  }
  return context;
}
