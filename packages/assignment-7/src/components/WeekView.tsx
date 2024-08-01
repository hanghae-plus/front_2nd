import {
  VStack,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Text,
} from '@chakra-ui/react';
import { formatWeek } from '../lib/utils/dateFormat';
import { weekDays } from '../constants/constants';
import { getWeekDates } from '../lib/utils/date';
import { Event } from '../types/types';
import { ViewBox } from './ViewBox';

interface WeekViewProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: number[];
}

export const WeekView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
}: WeekViewProps) => {
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
                data-testid={`week-date-${date.toISOString().split('T')[0]}`}
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
                      <ViewBox
                        key={event.id}
                        isNotified={isNotified}
                        title={event.title}
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
