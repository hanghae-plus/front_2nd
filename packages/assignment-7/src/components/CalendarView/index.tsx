import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Heading, HStack, IconButton, Select, VStack } from "@chakra-ui/react";
import useCalendarView from "../../hooks/useCalendarView";
import { Event } from "../../types";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

interface Props {
  filteredEvents: Array<Event>;
  notifiedEvents: Array<number>;
  calendarView: ReturnType<typeof useCalendarView>;
}
const CalendarView = ({
  filteredEvents,
  notifiedEvents,
  calendarView,
}: Props) => {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => calendarView.navigate("prev")}
        />
        <Select
          aria-label="view"
          value={calendarView.view}
          onChange={(e) =>
            calendarView.setView(e.target.value as "week" | "month")
          }
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => calendarView.navigate("next")}
        />
      </HStack>

      {calendarView.view === "week" && (
        <WeekView
          currentDate={calendarView.currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {calendarView.view === "month" && (
        <MonthView
          currentDate={calendarView.currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={calendarView.holidays}
        />
      )}
    </VStack>
  );
};

export default CalendarView;
