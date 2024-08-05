import EventManager from './components/EventManager';
import useEvents from './hooks/useEvents';
import useFetchHolidays from './hooks/useFetchHolidays';

function App() {
  const {
    formState,
    notificationsState,
    viewState,
    dialogState,
    currentDateState,
    searchState,
    cancelRef,
    saveEvent,
    deleteEvent,
    addOrUpdateEvent,
    filteredEvents,
  } = useEvents();

  const holidays = useFetchHolidays(currentDateState.currentDate);

  return (
    <EventManager
      formState={formState}
      notificationsState={notificationsState}
      viewState={viewState}
      dialogState={dialogState}
      currentDateState={currentDateState}
      searchState={searchState}
      cancelRef={cancelRef}
      saveEvent={saveEvent}
      deleteEvent={deleteEvent}
      addOrUpdateEvent={addOrUpdateEvent}
      filteredEvents={filteredEvents}
      holidays={holidays}
    />
  );
}

export default App;
