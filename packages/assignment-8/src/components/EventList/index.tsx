import useEventSearch from "@/hooks/useEventSearch";
import { Event } from "@/types";
import { FormControl, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import EventListItem from "./EventListItem";

interface Props {
  eventSearch: ReturnType<typeof useEventSearch>;
  notifiedEvents: Array<number>;
  editEvent: (event: Event) => void;
  deleteEvent: (event: Event) => void;
}
const EventList = ({
  eventSearch,
  notifiedEvents,
  editEvent,
  deleteEvent,
}: Props) => {
  return (
    <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder="검색어를 입력하세요"
          value={eventSearch.searchTerm}
          onChange={(e) => eventSearch.setSearchTerm(e.target.value)}
        />
      </FormControl>

      {eventSearch.filteredEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        eventSearch.filteredEvents.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
            notifiedEvents={notifiedEvents}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        ))
      )}
    </VStack>
  );
};

export default EventList;
