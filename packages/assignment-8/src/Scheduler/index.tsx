import CalendarView from "@/components/CalendarView";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import NotificationAlert from "@/components/NotificationAlert";
import OverlappingAlert from "@/components/OverlappingAlert";
import RepeatEventRemoveAlert from "@/components/RepeatEventRemoveAlert";
import { Box, Flex } from "@chakra-ui/react";
import useScheduler from "./useScheduler";

const Scheduler = () => {
  const {
    addOrUpdateEvent,
    eventForm,
    filteredEvents,
    notifiedEvents,
    calendarView,
    eventSearch,
    editEvent,
    deleteEvent,
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappedEvents,
    onClickGoing,
    notifications,
    setNotifications,
    isReapetEventRemoveDialogOpen,
    setIsRepeatEventRemoveDialogOpen,
    onClickRemoveParent,
    onClickRemoveOnlyTargetChild,
  } = useScheduler();

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm addOrUpdateEvent={addOrUpdateEvent} eventForm={eventForm} />
        <CalendarView
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          calendarView={calendarView}
        />
        <EventList
          eventSearch={eventSearch}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Flex>
      <OverlappingAlert
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappedEvents={overlappedEvents}
        onClickGoing={onClickGoing}
      />
      <NotificationAlert
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <RepeatEventRemoveAlert
        isReapetEventRemoveDialogOpen={isReapetEventRemoveDialogOpen}
        setIsRepeatEventRemoveDialogOpen={setIsRepeatEventRemoveDialogOpen}
        onClickRemoveParent={onClickRemoveParent}
        onClickRemoveOnlyTargetChild={onClickRemoveOnlyTargetChild}
      />
    </Box>
  );
};

export default Scheduler;
