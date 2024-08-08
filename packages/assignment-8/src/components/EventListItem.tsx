import { BellIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  VStack,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { notificationOptions } from "../magicnumbers";
import { Event } from "../types";
import { Dispatch, SetStateAction } from "react";

interface Props {
  keyValue: string;
  event: Event;
  notifiedEvents: number[];
  setEditingEvent: Dispatch<SetStateAction<Event | null>>;
  fetchEvents: () => Promise<void>;
}
const EventListItem = ({
  keyValue,
  event,
  notifiedEvents,
  setEditingEvent,
  fetchEvents,
}: Props) => {
  const toast = useToast();

  const deleteEvent = async (id: number) => {
    try {
      let response;
      if(event.isRepeat) {
        const updatedEvent = {repeat: {...event.repeat, excludeDates: [...(event.repeat.excludeDates||[]), new Date(event.date)]}}

        response = await fetch(`/api/events/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        });
      } else {
        response = await fetch(`/api/events/${id}`, {
          method: "DELETE",
        });
      }

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      await fetchEvents(); // 이벤트 목록 새로고침
      toast({
        title: "일정이 삭제되었습니다.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "일정 삭제 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box key={keyValue} data-testid={`listitem_${keyValue}`} borderWidth={1} borderRadius='lg' p={3} width='100%'>
      <HStack justifyContent='space-between'>
        <VStack align='start'>
          <HStack>
            {notifiedEvents.includes(event.id) && <BellIcon color='red.500' />}
            <Text
              fontWeight={notifiedEvents.includes(event.id) ? "bold" : "normal"}
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
            aria-label='Edit event'
            icon={<EditIcon />}
            onClick={() => setEditingEvent(event)}
          />
          <IconButton
            aria-label='Delete event'
            icon={<DeleteIcon />}
            onClick={() => deleteEvent(event.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default EventListItem;
