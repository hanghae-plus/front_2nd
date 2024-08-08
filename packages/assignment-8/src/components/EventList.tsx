import { VStack, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { filteredEvents, filteredRepeatEvents } from "../utils";
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
  const repeatEvents = filteredRepeatEvents(events, searchTerm, view, currentDate);
  const filteredAllEvents = [...filteredEventsList, ...repeatEvents];

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

      {filteredAllEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredAllEvents.map((event: Event, index: number) => {
          // event.id는 origin event의 것을 모든 반복일정이 고유해서 unique한 keyValue 따로 지정
          const keyValue = `${event.id}${event.isRepeat?('_'+index):''}`;
          return (
            <EventListItem
              key={keyValue}
              keyValue={keyValue}
              event={event}
              notifiedEvents={notifiedEvents}
              setEditingEvent={setEditingEvent}
              fetchEvents={fetchEvents}
            />
          )
        })
      )}
    </VStack>
  );
};

export default EventList;
