import { FC } from "react";
import { formatMonth, getDaysInMonth, weekDays } from "../../dateUtils";
import {
  Box,
  HStack,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Event } from "../../type/schedule.type";
import { BellIcon } from "@chakra-ui/icons";

interface Props {
  currentDate: Date;
  holidays: { [key: string]: string };
  filteredEvents: Event[];
  notifiedEvents: number[];
}

const CalenderMonth: FC<Props> = ({
  currentDate,
  holidays,
  filteredEvents,
  notifiedEvents,
}) => {
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
                  ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
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

export default CalenderMonth;
