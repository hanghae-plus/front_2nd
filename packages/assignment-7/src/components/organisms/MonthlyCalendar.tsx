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
import { Event, weekDays } from "../../App";
import { getDaysInMonth } from "../../utils/getDaysInMonth";
import { formatMonth } from "../../utils/formatMonth";
import { BellIcon } from "@chakra-ui/icons";
import { getWeeksInMonth } from "../../utils/getWeeksInMonth";

interface MonthlyCalendarProps {
  currentDate: Date;
  holidays: Record<string, string>;
  filteredEvents: Event[];
  notifiedEvents: number[];
}

export const MonthlyCalendar = ({
  currentDate,
  holidays,
  filteredEvents,
  notifiedEvents,
}: MonthlyCalendarProps) => {
  const weeks = getWeeksInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

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
                  >
                    {day && (
                      <>
                        <Text fontWeight="bold">{day}</Text>
                        {holiday && (
                          <Text color="red.500" fontSize="sm">
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
                                <HStack spacing={1}>
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
