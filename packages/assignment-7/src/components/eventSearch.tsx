import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { searchTermStore } from "../store/searchTermStore";
import { eventsStore } from "../store/eventsStore";
import { NOTIFICATION_OPTIONS } from "../const";
import { BellIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Event } from "../types";
import { deleteEvent } from "../utils/api";
import { useToasts } from "../hooks/useToasts.tsx";
import { useEffect } from "react";

type EventSearchProps = {
  filteredEvents: Event[];
};

export const EventSearch = ({ filteredEvents }: EventSearchProps) => {
  const { searchTerm, setSearchTerm } = searchTermStore();
  const {
    notifiedEvents,
    editingEvent,
    setEditingEvent,
    setIsEventEdit,
    setIsEventDeleted,
  } = eventsStore();

  const toast = useToast();
  const { getToastOptions } = useToasts();

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      setIsEventDeleted(true);
      toast(getToastOptions("deletingEventSuccess"));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast(getToastOptions("deletingEventFailToast"));
    }
  };
  useEffect(() => {
    if (editingEvent) {
      setIsEventEdit(true);
    }
  }, [editingEvent]);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  return (
    <VStack
      role="searchItemsContainer"
      data-testid="event-list"
      w="500px"
      h="full"
      overflowY="auto"
    >
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      {filteredEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredEvents.map((event) => (
          <Box
            role="searchItem"
            key={event.id}
            borderWidth={1}
            borderRadius="lg"
            p={3}
            width="100%"
          >
            <HStack justifyContent="space-between">
              <VStack align="start">
                <HStack>
                  {notifiedEvents.includes(event.id) && (
                    <BellIcon color="red.500" />
                  )}
                  <Text
                    fontWeight={
                      notifiedEvents.includes(event.id) ? "bold" : "normal"
                    }
                    color={
                      notifiedEvents.includes(event.id) ? "red.500" : "inherit"
                    }
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
                    NOTIFICATION_OPTIONS.find(
                      (option) => option.value === event.notificationTime
                    )?.label
                  }
                </Text>
              </VStack>
              <HStack>
                <IconButton
                  aria-label="Edit event"
                  icon={<EditIcon />}
                  onClick={() => {
                    handleEditEvent(event);
                  }}
                />
                <IconButton
                  aria-label="Delete event"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteEvent(event.id)}
                />
              </HStack>
            </HStack>
          </Box>
        ))
      )}
    </VStack>
  );
};
