import { FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import EventList from "../event/EventList";
import { Event } from "../../App";

interface EventPanelProps {
  searchTerm: string;
  setSearchTerm: (value: React.SetStateAction<string>) => void;
  filteredEvents: Event[];
  notifiedEvents: number[];
  editEvent: (event: Event) => void;
  deleteEvent: (id: number) => Promise<void>;
}

const EventPanel = ({
  searchTerm,
  setSearchTerm,
  filteredEvents,
  notifiedEvents,
  editEvent,
  deleteEvent,
}: EventPanelProps) => {
  return (
    <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>
      <EventList
        filteredEvents={filteredEvents}
        notifiedEvents={notifiedEvents}
        editEvent={editEvent}
        deleteEvent={deleteEvent}
      />
    </VStack>
  );
};

export default EventPanel;
