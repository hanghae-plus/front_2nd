import { Box, Text, HStack, VStack, IconButton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, BellIcon } from '@chakra-ui/icons';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  isNotified: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

function EventCard({ event, isNotified, onEdit, onDelete }: EventCardProps) {
  return (
    <Box
      data-testid={`event-${event.id}`}
      borderWidth={1}
      borderRadius='lg'
      p={3}
      width='100%'
      boxShadow='md' // 카드 느낌을 더 강조하기 위해 그림자 추가
    >
      <HStack justifyContent='space-between'>
        <VStack align='start' spacing={1}>
          <HStack>
            {isNotified && <BellIcon color='red.500' />}
            <Text
              fontWeight={isNotified ? 'bold' : 'normal'}
              color={isNotified ? 'red.500' : 'inherit'}
            >
              {event.title}
            </Text>
          </HStack>
          <Text fontSize='sm'>
            {event.date} {event.startTime} - {event.endTime}
          </Text>
          <Text fontSize='sm'>{event.description}</Text>
          <Text fontSize='sm'>{event.location}</Text>
          <Text fontSize='sm'>카테고리: {event.category}</Text>
          {event.repeat.type !== 'none' && (
            <Text fontSize='sm'>
              반복: {event.repeat.interval}
              {event.repeat.type === 'daily' && '일'}
              {event.repeat.type === 'weekly' && '주'}
              {event.repeat.type === 'monthly' && '월'}
              {event.repeat.type === 'yearly' && '년'}
              마다
              {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
            </Text>
          )}
        </VStack>
        <HStack>
          <IconButton
            aria-label='Edit event'
            icon={<EditIcon />}
            onClick={() => onEdit(event)}
          />
          <IconButton
            aria-label='Delete event'
            icon={<DeleteIcon />}
            onClick={() => onDelete(event.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
}

export default EventCard;
