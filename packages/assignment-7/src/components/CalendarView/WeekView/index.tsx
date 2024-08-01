import { weekDaysWeek } from "@/contants";
import { Event } from "@/types";
import formatWeek from "@/utils/formatWeek";
import getWeekDates from "@/utils/getWeekDates";
import { BellIcon } from "@chakra-ui/icons";
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

interface Props {
  currentDate: Date;
  filteredEvents: Array<Event>;
  notifiedEvents: Array<number>;
}
const WeekView = ({ currentDate, filteredEvents, notifiedEvents }: Props) => {
  const weekDates = getWeekDates(currentDate);
  return (
    <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatWeek(currentDate)}</Heading>
      <Table variant="simple" w="full">
        <Thead>
          <Tr>
            {weekDaysWeek.map((day) => (
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

export default WeekView;
