import { getWeekDates } from "../../utils/getWeekDates";

import { BellIcon } from "@chakra-ui/icons";
import {
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
import { Event, weekDays } from "../../App";
import { formatWeek } from "../../utils/formatWeek";
import { NotificationItem } from "../atom/NotificationItem";
import { getRepeatedEvents } from "../../services/getRepeatedEvents";

interface WeeklyCalendarProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: number[];
}

export const WeeklyCalendar = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
}: WeeklyCalendarProps) => {
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
                      <NotificationItem
                        key={event.id}
                        title={event.title}
                        isNotified={isNotified}
                        isRepeating={!!event.repeat}
                        additional={{
                          left: isNotified ? <BellIcon /> : undefined,
                        }}
                      />
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
