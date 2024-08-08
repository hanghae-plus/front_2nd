import useCalendarView from "@/hooks/useCalendarView";
import useEventForm from "@/hooks/useEventForm";
import useEventManager from "@/hooks/useEventManager";
import useEventNotifications from "@/hooks/useEventNotifications";
import useEventSearch from "@/hooks/useEventSearch";
import useOverlappingEvents from "@/hooks/useOverlappingEvents";
import { Event } from "@/types";
import { useState } from "react";

const useScheduler = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const eventForm = useEventForm();
  const calendarView = useCalendarView();
  const eventNotifications = useEventNotifications({ events });
  const overlappingEvents = useOverlappingEvents({ events });

  const {
    editingEvent,
    setEditingEvent,
    resetForm,
    editEvent,
    eventFormData,
    validateSubmitEventForm,
  } = eventForm;
  const { view, currentDate } = calendarView;
  const { notifications, setNotifications, notifiedEvents } =
    eventNotifications;
  const {
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappedEvents,
    getIsOverlappingAndSetOverlappingEvents,
  } = overlappingEvents;

  const eventSearch = useEventSearch({ events, view, currentDate });
  const { filteredEvents } = eventSearch;

  const { addOrUpdateEvent, saveEvent, deleteEvent, repeatEventRemoveDialog } =
    useEventManager({
      events,
      validateSubmitEventForm,
      eventFormData,
      getIsOverlappingAndSetOverlappingEvents,
      editingEvent,
      setEditingEvent,
      resetForm,
      setEvents,
    });

  const onClickGoing = () => {
    setIsOverlapDialogOpen(false);
    saveEvent({
      id: editingEvent ? editingEvent.id : Date.now(),
      ...eventFormData,
    });
  };

  return {
    addOrUpdateEvent,
    eventForm,
    filteredEvents,
    notifiedEvents,
    calendarView,
    eventSearch,
    editEvent,
    deleteEvent,
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappedEvents,
    onClickGoing,
    notifications,
    setNotifications,
    ...repeatEventRemoveDialog,
  };
};

export default useScheduler;
