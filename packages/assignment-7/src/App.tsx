import { Box, Flex, useInterval } from "@chakra-ui/react";
import EventForm from "./components/form/EventForm";
import EventAlert from "./components/alert/EventAlert";
import EventNotification from "./components/notification/EventNotification";
import EventList from "./components/list/EventList";

import EventCalender from "./components/calender/EventCalender";
import { useEventManagement } from "./hooks/useEventManagement";

function App() {
  const {
    eventForm,
    timeValidation,
    repeatSettings,
    overlapDetection,
    notifications,
    setNotifications,
    searchTerm,
    setSearchTerm,
    filteredEvents,
    notifiedEvents,
    currentDate,
    view,
    setView,
    navigate,
    holidays,
    handleStartTimeChange,
    handleEndTimeChange,
    addOrUpdateEvent,
    saveEvent,
    editEvent,
    deleteEvent,
    checkUpcomingEvents,
  } = useEventManagement();

  useInterval(checkUpcomingEvents, 1000);
  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm
          form={{
            title: eventForm.title,
            setTitle: eventForm.setTitle,
            date: eventForm.date,
            setDate: eventForm.setDate,
            startTime: eventForm.startTime,
            setStartTime: eventForm.setStartTime,
            endTime: eventForm.endTime,
            setEndTime: eventForm.setEndTime,
            description: eventForm.description,
            setDescription: eventForm.setDescription,
            location: eventForm.location,
            setLocation: eventForm.setLocation,
            category: eventForm.category,
            setCategory: eventForm.setCategory,
            isRepeating: repeatSettings.isRepeating,
            setIsRepeating: repeatSettings.setIsRepeating,
            repeatType: repeatSettings.repeatType,
            setRepeatType: repeatSettings.setRepeatType,
            repeatInterval: repeatSettings.repeatInterval,
            setRepeatInterval: repeatSettings.setRepeatInterval,
            repeatEndDate: repeatSettings.repeatEndDate,
            setRepeatEndDate: repeatSettings.setRepeatEndDate,
          }}
          editingEvent={eventForm.editingEvent}
          startTimeError={timeValidation.startTimeError}
          handleStartTimeChange={handleStartTimeChange}
          validateTime={timeValidation.validateTime}
          endTimeError={timeValidation.endTimeError}
          handleEndTimeChange={handleEndTimeChange}
          notificationTime={eventForm.notificationTime}
          setNotificationTime={eventForm.setNotificationTime}
          addOrUpdateEvent={addOrUpdateEvent}
        />
        <EventCalender
          view={view}
          setView={setView}
          navigate={navigate}
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />

        <EventList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Flex>

      <EventAlert
        isOverlapDialogOpen={overlapDetection.isOverlapDialogOpen}
        setIsOverlapDialogOpen={overlapDetection.setIsOverlapDialogOpen}
        overlappingEvents={overlapDetection.overlappingEvents}
        saveEvent={saveEvent}
        editingEvent={eventForm.editingEvent}
        title={eventForm.title}
        date={eventForm.date}
        startTime={eventForm.startTime}
        endTime={eventForm.endTime}
        description={eventForm.description}
        location={eventForm.location}
        category={eventForm.category}
        notificationTime={eventForm.notificationTime}
        isRepeating={repeatSettings.isRepeating}
        repeatType={repeatSettings.repeatType}
        repeatInterval={repeatSettings.repeatInterval}
        repeatEndDate={repeatSettings.repeatEndDate}
      />

      {notifications.length > 0 && (
        <EventNotification
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}
    </Box>
  );
}

export default App;
