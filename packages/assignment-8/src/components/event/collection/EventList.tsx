import { BellIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { Event } from "../../../types/types";

interface EventListProps {
  filteredEvents: Event[];
  notifiedEvents: number[];
  editEvent: (event: Event) => void;
  deleteEvent: (id: number) => Promise<void>;
}

const notificationOptions = [
  { value: 1, label: "1분 전" },
  { value: 10, label: "10분 전" },
  { value: 60, label: "1시간 전" },
  { value: 120, label: "2시간 전" },
  { value: 1440, label: "1일 전" },
];

const EventList = ({
  filteredEvents,
  notifiedEvents,
  editEvent,
  deleteEvent,
}: EventListProps) => {
  // 이벤트 삭제

  return (
    <>
      {filteredEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredEvents.map((event) => {
          const editingEvent = () => {
            editEvent(event);
          };
          const deletingEvent = () => {
            deleteEvent(event.id);
          };
          return (
            <ProductCardView
              key={event.id}
              id={event.id}
              event={event}
              notifiedEvents={notifiedEvents}
              onClickEditEvent={editingEvent}
              onClickDeleteEvent={deletingEvent}
            />
          );
        })
      )}
    </>
  );
};

interface productCardView {
  event: Event;
  id: number;
  notifiedEvents: number[];
  onClickEditEvent: () => void;
  onClickDeleteEvent: () => void;
}

const ProductCardView = ({
  notifiedEvents,
  event,
  id,
  onClickEditEvent,
  onClickDeleteEvent,
}: productCardView) => {
  return (
    <Box key={id} borderWidth={1} borderRadius="lg" p={3} width="100%">
      <HStack justifyContent="space-between">
        <VStack align="start">
          <HStack>
            {notifiedEvents.includes(id) && <BellIcon color="red.500" />}
            <Text
              data-testid="event-title"
              data-cy="event-title"
              fontWeight={notifiedEvents.includes(id) ? "bold" : "normal"}
              color={notifiedEvents.includes(event.id) ? "red.500" : "inherit"}
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
          {event.repeat.type !== "none" && (
            <Text>
              반복: {event.repeat.interval}
              {event.repeat.type === "daily" && "일"}
              {event.repeat.type === "weekly" && "주"}
              {event.repeat.type === "monthly" && "월"}
              {event.repeat.type === "yearly" && "년"}
              마다
              {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
            </Text>
          )}
          <Text>
            알림:{" "}
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
            data-cy="edit-event"
            icon={<EditIcon />}
            onClick={onClickEditEvent}
          />
          <IconButton
            aria-label="Delete event"
            data-cy="delete-event"
            icon={<DeleteIcon />}
            onClick={onClickDeleteEvent}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default EventList;
