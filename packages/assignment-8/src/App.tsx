import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import {
  SchedulerProvider,
  useSchedulerContext,
} from "./contexts/SchedulerContext";
import CalendarView from "./components/CalendarView";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import OverlapDialog from "./components/OverlapDialog";
import NotificationList from "./components/NotificationList";
import { useEffect } from "react";

function AppContent() {
  const { events } = useSchedulerContext();

  useEffect(() => {
    events.fetchEvents();
  }, []);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm />
        <CalendarView />
        <EventList />
      </Flex>
      <OverlapDialog />
      <NotificationList />
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider>
      <SchedulerProvider>
        <AppContent />
      </SchedulerProvider>
    </ChakraProvider>
  );
}

export default App;
