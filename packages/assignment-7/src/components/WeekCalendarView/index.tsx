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
import { formatWeek, getWeekDates } from "../../utils/date";
import useGetFilteredEvents from "../../hooks/useGetFilteredEvents";
import useNotifiedEvents from "../../hooks/useNotifiedEvents";
import { EventType } from "../../types/event";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const WeekCalendar = ({
  currentDate,
  searchTerm,
}: {
  currentDate: Date;
  searchTerm: string;
}) => {
  const { filteredEvents } = useGetFilteredEvents(
    searchTerm,
    currentDate,
    "week"
  );
  const { notifiedEvents } = useNotifiedEvents({
    now: currentDate,
  });
  return (
    <WeekCalendarView
      currentDate={currentDate}
      filteredEvents={filteredEvents}
      notifiedEvents={notifiedEvents}
    />
  );
};

type WeekCalendarViewProps = {
  currentDate: Date;
  filteredEvents: EventType[];
  notifiedEvents: number[];
};

const WeekCalendarView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
}: WeekCalendarViewProps) => {
  const weekDates = getWeekDates(currentDate);

  return (
    <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatWeek(currentDate)}</Heading>
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
          <Tr>
            {weekDates.map((date) => (
              <Td
                key={date.toISOString()}
                height="100px"
                verticalAlign="top"
                width="14.28%"
              >
                <Text fontWeight="bold">{date.getDate()}</Text>
                {filteredEvents
                  .filter(
                    (event) =>
                      new Date(event.date).toDateString() ===
                      date.toDateString()
                  )
                  .map((event) => {
                    const isNotified = notifiedEvents.includes(event.id);
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
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
};

export default WeekCalendar;
