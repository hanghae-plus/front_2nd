import { Dispatch, SetStateAction } from "react";
import { Heading, HStack, IconButton, Select, VStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Event } from "../../types";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

interface Props {
  view: "week" | "month";
  setView: Dispatch<SetStateAction<"week" | "month">>;
  navigate: (direction: "prev" | "next") => void;
  currentDate: Date;
  holidays: { [key: string]: string };
  filteredEvents: Event[];
  notifiedEvents: number[];
}

const EventView = ({
  view,
  setView,
  navigate,
  currentDate,
  holidays,
  filteredEvents,
  notifiedEvents,
}: Props) => {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate("prev")}
        />
        <Select
          aria-label="view"
          value={view}
          onChange={(e) => setView(e.target.value as "week" | "month")}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => navigate("next")}
        />
      </HStack>

      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
    </VStack>
  );
};

export default EventView;
