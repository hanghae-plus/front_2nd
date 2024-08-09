import {
  Box,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { weekDays } from "../../shared/constants";
import { type EventType, RepeatEvent } from "../../types/event";

import useGetFilteredEvents from "../../hooks/useGetFilteredEvents";
import useGetHolidays from "../../hooks/useGetHolidays";
import useNotifiedEvents from "../../hooks/useNotifiedEvents";

import { getRepeatingEventForDate } from "../../utils/repeat";
import { formatMonth, getMonthData, WeekData } from "../../utils/date";

type MonthCalendarProps = {
  events: EventType[] | undefined;
  currentDate: Date;
  searchTerm: string;
  repeatEvent: RepeatEvent | null;
};

const MonthCalendar = ({
  events,
  currentDate,
  searchTerm,
  repeatEvent,
}: MonthCalendarProps) => {
  const { filteredEvents } = useGetFilteredEvents({
    events,
    searchTerm,
    currentDate,
    view: "month",
  });
  const { holidays } = useGetHolidays();
  const { notifiedEvents } = useNotifiedEvents({ events, now: currentDate });
  const weeks = getMonthData(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <MonthCalendarView
      currentDate={currentDate}
      holidays={holidays}
      filteredEvents={filteredEvents}
      notifiedEvents={notifiedEvents}
      repeatEvent={repeatEvent}
      weeks={weeks}
    />
  );
};

type MonthCalendarViewProps = {
  currentDate: Date;
  holidays: Record<string, string>;
  filteredEvents: EventType[] | undefined;
  notifiedEvents: number[];
  repeatEvent: RepeatEvent | null;
  weeks: WeekData[];
};

const MonthCalendarView = ({
  currentDate,
  holidays,
  filteredEvents,
  notifiedEvents,
  repeatEvent,
  weeks,
}: MonthCalendarViewProps) => {
  return (
    <VStack data-testid="month-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatMonth(currentDate)}</Heading>
      <Table variant="simple" w="full">
        <Thead>
          <Tr>
            {weekDays.map((day) => (
              <Th key={day} width="14.28%">
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {weeks.map((week, weekIndex) => (
            <Tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dateString = day
                  ? `${currentDate.getFullYear()}-${String(
                      currentDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  : "";
                const holiday = holidays[dateString];
                const isRepeating =
                  repeatEvent &&
                  getRepeatingEventForDate(repeatEvent, dateString);

                return (
                  <Td
                    key={dayIndex}
                    height="100px"
                    verticalAlign="top"
                    width="14.28%"
                    position="relative"
                    data-testid={dateString}
                  >
                    {day && (
                      <>
                        <Text fontWeight="bold">{day}</Text>
                        {holiday && (
                          <Text
                            color="red.500"
                            fontSize="sm"
                            data-testid={holiday}
                          >
                            {holiday}
                          </Text>
                        )}
                        {filteredEvents
                          ?.filter(
                            (event) => new Date(event.date).getDate() === day
                          )
                          .map((event) => {
                            const isNotified = notifiedEvents.includes(
                              event.id
                            );

                            return (
                              <Box
                                key={event.id}
                                p={1}
                                my={1}
                                bg={isNotified ? "red.100" : "gray.100"}
                                borderRadius="md"
                                fontWeight={isNotified ? "bold" : "normal"}
                                color={isNotified ? "red.500" : "inherit"}
                              >
                                <HStack spacing={1} data-testid="event-badge">
                                  {isNotified && <BellIcon />}
                                  <Text fontSize="sm" noOfLines={1}>
                                    {event.title}
                                  </Text>
                                </HStack>
                              </Box>
                            );
                          })}
                        {isRepeating && (
                          <Box
                            borderRadius="md"
                            fontWeight={"normal"}
                            color={"inherit"}
                          >
                            <Text
                              fontSize="10px"
                              textAlign="center"
                              data-testid="repeat-event"
                            >
                              반복 일정
                            </Text>
                          </Box>
                        )}
                      </>
                    )}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default MonthCalendar;
