import React from 'react';
import { VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Box, HStack } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { Event } from '../../types/types';
import { formatWeek, getWeekDates } from '../../utils/utils';
import { WEEK_DAYS } from '../../constants/constants';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  notifiedEvents: number[];
  holidays: { [key: string]: string };
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, notifiedEvents, holidays }) => {
  const weekDates = getWeekDates(currentDate);

  return (
    <VStack data-testid='week-view' align='stretch' w='full' spacing={4}>
      <Heading size='md'>{formatWeek(currentDate)}</Heading>
      <Table variant='simple' w='full'>
        <Thead>
          <Tr>
            {WEEK_DAYS.map((day) => (
              <Th key={day} width='14.28%'>
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {weekDates.map((date) => {
              const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
                date.getDate()
              ).padStart(2, '0')}`;
              const holiday = holidays[dateString];

              return (
                <Td key={date.toISOString()} height='100px' verticalAlign='top' width='14.28%'>
                  <Text fontWeight='bold'>{date.getDate()}</Text>
                  {holiday && (
                    <Text color='red.500' fontSize='sm'>
                      {holiday}
                    </Text>
                  )}
                  {events
                    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
                    .map((event) => {
                      const isNotified = notifiedEvents.includes(event.id);
                      return (
                        <Box
                          key={event.id}
                          p={1}
                          my={1}
                          bg={isNotified ? 'red.100' : 'gray.100'}
                          borderRadius='md'
                          fontWeight={isNotified ? 'bold' : 'normal'}
                          color={isNotified ? 'red.500' : 'inherit'}>
                          <HStack spacing={1}>
                            {isNotified && <BellIcon />}
                            <Text fontSize='sm' noOfLines={1}>
                              {event.title}
                            </Text>
                          </HStack>
                        </Box>
                      );
                    })}
                </Td>
              );
            })}
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
};

export default WeekView;
