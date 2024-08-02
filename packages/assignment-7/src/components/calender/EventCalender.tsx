import React from "react";
import { VStack, Heading, HStack, IconButton, Select } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import CalenderWeek from "./CalenderWeek";
import CalenderMonth from "./CalenderMonth";
import { Event } from "../../type/schedule.type";

interface EventCalenderProps {
  view: "week" | "month";
  setView: (view: "week" | "month") => void;
  navigate: (direction: "prev" | "next") => void;
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: number[];
  holidays: { [key: string]: string };
}

const EventCalender: React.FC<EventCalenderProps> = ({
  view,
  setView,
  navigate,
  currentDate,
  filteredEvents,
  notifiedEvents,
  holidays,
}) => {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>
      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          data-testid="calender-prev-button"
          onClick={() => navigate("prev")}
        />
        <Select
          aria-label="view"
          data-testid="calender-type-select"
          value={view}
          onChange={(e) => setView(e.target.value as "week" | "month")}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          data-testid="calender-next-button"
          icon={<ChevronRightIcon />}
          onClick={() => navigate("next")}
        />
      </HStack>

      {view === "week" && (
        <CalenderWeek
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === "month" && (
        <CalenderMonth
          currentDate={currentDate}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
    </VStack>
  );
};

export default EventCalender;
