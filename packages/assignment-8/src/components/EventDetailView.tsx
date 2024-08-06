import { Box, HStack, VStack, Text, IconButton } from '@chakra-ui/react';
import { BellIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Event } from '../types/types';
import { notificationOptions } from '../constants/constants';

interface EventDetailViewProps extends Event {
  notifiedEvents: number[];
  editEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
}

export const EventDetailView = ({
  notifiedEvents,
  editEvent,
  deleteEvent,
  ...event
}: EventDetailViewProps) => {
  return (
    <Box
      key={event.id}
      data-testid={`event-item-${event.id}`}
      borderWidth={1}
      borderRadius="lg"
      p={3}
      width="100%"
    >
      <HStack justifyContent="space-between">
        <VStack align="start">
          <HStack>
            {notifiedEvents.includes(event.id) && <BellIcon color="red.500" />}
            <Text
              fontWeight={notifiedEvents.includes(event.id) ? 'bold' : 'normal'}
              color={notifiedEvents.includes(event.id) ? 'red.500' : 'inherit'}
              as="h3"
            >
              {event.title}
            </Text>
          </HStack>
          <Text>
            {event.date} {event.startTime} - {event.endTime}
          </Text>
          <Text>{event.description}</Text>
          <Text>{event.location}</Text>
          <Text>카테고리: {event.category}</Text>
          {event.repeat && event.repeat.type !== 'none' && (
            <Text>
              반복: {event.repeat.interval}
              {event.repeat.type === 'daily' && '일'}
              {event.repeat.type === 'weekly' && '주'}
              {event.repeat.type === 'monthly' && '월'}
              {event.repeat.type === 'yearly' && '년'}
              마다
              {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
            </Text>
          )}
          <Text>
            알림:{' '}
            {
              notificationOptions.find(
                (option) => option.value === event.notificationTime
              )?.label
            }
          </Text>
        </VStack>
        <HStack>
          <IconButton
            aria-label="Edit event"
            icon={<EditIcon />}
            onClick={() => editEvent(event)}
          />
          <IconButton
            aria-label="Delete event"
            icon={<DeleteIcon />}
            onClick={() => deleteEvent(event.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
};
