import { Event, ViewType } from "@/types";
import getWeekDates from "@/utils/getWeekDates";
import { useCallback, useMemo, useState } from "react";

interface Props {
  events: Array<Event>;
  view: ViewType;
  currentDate: Date;
}
const useEventSearch = ({ events, view, currentDate }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  /**
   * 일정 검색하기
   */
  const searchEvents = useCallback(
    (term: string) => {
      if (!term.trim()) return events;

      return events.filter(
        (event) =>
          event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.description.toLowerCase().includes(term.toLowerCase()) ||
          event.location.toLowerCase().includes(term.toLowerCase())
      );
    },
    [events]
  );

  const getEventWithChildren = (events: Array<Event>) => {
    const eventsForRender: Array<Event> = [];

    events.forEach((event) => {
      eventsForRender.push(event);

      if (!event.children) {
        return;
      }

      event.children.forEach((child) => {
        eventsForRender.push(child);
      });
    });

    return eventsForRender;
  };

  /**
   * 렌더링용 일정 생성 및 필터링
   * - 렌더링용 반복 일정 생성
   * - 주간 및 월간 기준 일정 필터링
   */
  const filteredEvents = useMemo(() => {
    const filtered = searchEvents(searchTerm);

    const eventsForRender = getEventWithChildren(filtered);

    return eventsForRender.filter((event) => {
      const eventDate = new Date(event.date);

      if (view === "week") {
        return getWeekDates(currentDate).some(
          (date) => date.toDateString() === eventDate.toDateString()
        );
      } else if (view === "month") {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
      return true;
    });
  }, [currentDate, searchTerm, view, searchEvents]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};

export default useEventSearch;
