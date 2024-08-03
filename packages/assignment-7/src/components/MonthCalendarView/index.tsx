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
import { formatMonth, getDaysInMonth } from "../../utils/date";
import useGetFilteredEvents from "../../hooks/useGetFilteredEvents";
import { weekDays } from "../../shared/weekdays";
import { EventType } from "../../types/event";
import useGetHolidays from "../../hooks/useGetHolidays";
import useNotifiedEvents from "../../hooks/useNotifiedEvents";

type MonthCalendarProps = {
  notifiedEvents: number[];
  currentDate: Date;
  searchTerm: string;
};

const MonthCalendar = ({ currentDate, searchTerm }: MonthCalendarProps) => {
  const { filteredEvents } = useGetFilteredEvents(
    searchTerm,
    currentDate,
    "month"
  );
  const { holidays } = useGetHolidays();
  const { notifiedEvents } = useNotifiedEvents({ now: currentDate });

  return (
    <MonthCalendarView
      currentDate={currentDate}
      holidays={holidays}
      filteredEvents={filteredEvents}
      notifiedEvents={notifiedEvents}
    />
  );
};

type MonthCalendarViewProps = {
  currentDate: Date;
  holidays: Record<string, string>;
  filteredEvents: EventType[];
  notifiedEvents: number[];
};

const MonthCalendarView = ({
  currentDate,
  holidays,
  filteredEvents,
  notifiedEvents,
}: MonthCalendarViewProps) => {
  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];
  let week = Array(7).fill(null);

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = Array(7).fill(null);
    }
  }
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
                          .filter(
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
