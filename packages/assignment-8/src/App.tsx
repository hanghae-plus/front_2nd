import { Box, Flex } from "@chakra-ui/react";

import { EventForm } from "./components/eventForm";
import { EventSearch } from "./components/eventSearch";
import { Canlendar } from "./components/calendar";
import { useView } from "./hooks/useView.tsx";

function App() {
  const { view, handleSetView, filteredEvents } = useView();

  const calendarProps = {
    view,
    handleSetView,
    filteredEvents,
  };

  const eventSearchProps = {
    filteredEvents,
  };

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm />
        <Canlendar {...calendarProps} />
        <EventSearch {...eventSearchProps} />
      </Flex>
    </Box>
  );
}

export default App;
