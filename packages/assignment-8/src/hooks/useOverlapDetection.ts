import { useState } from "react";
import { Event } from "../type/schedule.type";
import { isOverlapping } from "../dateUtils";

export const useOverlapDetection = (events: Event[]) => {
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const findOverlappingEvents = (newEvent: Event): Event[] => {
    return events.filter(
      (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
    );
  };

  return {
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappingEvents,
    setOverlappingEvents,
    findOverlappingEvents,
  };
};
