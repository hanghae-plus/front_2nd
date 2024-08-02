import { ChangeEvent, useMemo, useState } from "react";
import { VStack, Text } from "@chakra-ui/react";
import { useSchedulerContext } from "../contexts/SchedulerContext";
import EventCard from "./EventCard";
import SearchBar from "./SearchBar";

function EventList() {
  const { events, calendar, notifications } = useSchedulerContext();
  const { events: eventList, deleteEvent } = events;
  const { currentDate, view } = calendar;
  const { notifiedEvents } = notifications;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    return eventList.filter((event) => {
      const eventDate = new Date(event.date);
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      if (view === "week") {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return eventDate >= weekStart && eventDate <= weekEnd && matchesSearch;
      } else if (view === "month") {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear() &&
          matchesSearch
        );
      }
      return matchesSearch;
    });
  }, [eventList, currentDate, view, searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <VStack
      data-testid="event-list"
      w="500px"
      h="full"
      overflowY="auto"
      spacing={4}
    >
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      {filteredEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isNotified={notifiedEvents.includes(event.id)}
            onEdit={(event) => {
              // 여기서 이벤트 편집을 위한 상태를 설정하거나 모달을 열 수 있습니다.
              console.log("Edit event:", event);
            }}
            onDelete={() => deleteEvent(event.id)}
          />
        ))
      )}
    </VStack>
  );
}

export default EventList;
