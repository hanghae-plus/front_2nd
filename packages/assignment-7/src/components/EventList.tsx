import { VStack, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { filteredEvents } from "../utils";
import EventListItem from "./EventListItem";
import { Dispatch, SetStateAction } from "react";
import { Event } from "../types";

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  events: Event[];
  view: "week" | "month";
  currentDate: Date;
  notifiedEvents: number[];
  setEditingEvent: Dispatch<SetStateAction<Event | null>>;
  fetchEvents: () => Promise<void>;
}

const EventList = ({
  searchTerm,
  setSearchTerm,
  events,
  view,
  currentDate,
  notifiedEvents,
  setEditingEvent,
  fetchEvents,
}: Props) => {
  const filteredEventsList = filteredEvents(
    events,
    searchTerm,
    view,
    currentDate
  );

  return (
    <VStack data-testid='event-list' w='500px' h='full' overflowY='auto'>
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder='검색어를 입력하세요'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      {filteredEventsList.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredEventsList.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
            notifiedEvents={notifiedEvents}
            setEditingEvent={setEditingEvent}
            fetchEvents={fetchEvents}
          />
        ))
      )}
    </VStack>
  );
};

export default EventList;
