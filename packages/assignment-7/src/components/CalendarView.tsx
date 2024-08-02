import {
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Box,
  HStack,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, BellIcon } from "@chakra-ui/icons";
import { useSchedulerContext } from "../contexts/SchedulerContext";
import { WEEKDAYS } from "../constants";
import { useNotifications } from "../hooks/useNotifications";

function CalendarView() {
  const { calendar, events } = useSchedulerContext();
  const {
    currentDate,
    view,
    holidays,
    navigate,
    changeView,
    formatWeek,
    formatMonth,
    getWeekDates,
    getDaysInMonth,
  } = calendar;

  const { events: eventList } = events;
  const { notifiedEvents } = useNotifications(eventList);

  function WeekView() {
    const weekDates = getWeekDates(currentDate);
    return (
      <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
        <Heading size="md">{formatWeek(currentDate)}</Heading>
        <Table variant="simple" w="full">
          <Thead>
            <Tr>
              {WEEKDAYS.map((day) => (
                <Th key={day} width="14.28%">
                  {day}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              {weekDates.map((date) => (
                <Td
                  key={date.toISOString()}
                  height="100px"
                  verticalAlign="top"
                  width="14.28%"
                  data-testid={`week-cell-${date.getDate()}`}
                >
                  <Text fontWeight="bold">{date.getDate()}</Text>
                  {renderEvents(date)}
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    );
  }

  function MonthView() {
    const daysInMonth = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weeks = [];
    let week = Array(7).fill(null);

    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = null;
    }

    for (const day of days) {
      const dayIndex = (firstDayOfMonth + day - 1) % 7;
      week[dayIndex] = day;
      if (dayIndex === 6 || day === daysInMonth) {
        weeks.push(week);
        week = Array(7).fill(null);
      }
    }

    return (
      <VStack data-testid="month-view" align="stretch" w="full" spacing={4}>
        <Heading size="md">{formatMonth(currentDate)}</Heading>
        <Table variant="simple" w="full">
          <Thead>
            <Tr>
              {WEEKDAYS.map((day) => (
                <Th key={day} width="14.28%">
                  {day}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {weeks.map((week, weekIndex) => (
              <Tr key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <Td
                    key={dayIndex}
                    height="100px"
                    verticalAlign="top"
                    width="14.28%"
                    position="relative"
                    data-testid={`month-cell-${day}`}
                  >
                    {day && (
                      <>
                        <Text fontWeight="bold">{day}</Text>
                        {renderHoliday(day)}
                        {renderEvents(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            day
                          )
                        )}
                      </>
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    );
  }

  function renderEvents(date: Date) {
    return eventList
      .filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      )
      .map((event) => {
        const isNotified = notifiedEvents.includes(event.id);
        return (
          <Box
            key={event.id}
            data-testid={`event-${event.id}`}
            p={1}
            my={1}
            bg={isNotified ? "red.100" : "gray.100"}
            borderRadius="md"
            fontWeight={isNotified ? "bold" : "normal"}
            color={isNotified ? "red.500" : "inherit"}
          >
            <HStack spacing={1}>
              {isNotified && <BellIcon />}
              <Text fontSize="sm" noOfLines={1}>
                {event.title}
              </Text>
            </HStack>
          </Box>
        );
      });
  }

  function renderHoliday(day: number) {
    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const holiday = holidays[dateString];

    if (holiday) {
      return (
        <Text color="red.500" fontSize="sm">
          {holiday}
        </Text>
      );
    }
    return null;
  }

  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate("prev")}
        />
        <Select
          aria-label="view"
          value={view}
          onChange={(e) => changeView(e.target.value as "week" | "month")}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => navigate("next")}
        />
      </HStack>

      {view === "week" ? <WeekView /> : <MonthView />}
    </VStack>
  );
}

export default CalendarView;
