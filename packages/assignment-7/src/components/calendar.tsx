import { BellIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useInterval,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
} from "../utils/date";
import { WEEKDAYS } from "../const";
import { AlertNotificationToast } from "./alertNotificaitonToast";
import { currentDateStore } from "../store/currentDateStore";
import { notificationsStore } from "../store/notificationsStore";
import { eventsStore } from "../store/eventsStore";
import { Event } from "../types";

type CalendarProps = {
  view: "week" | "month";
  handleSetView: (view: "week" | "month") => void;
  filteredEvents: Event[];
};

export const Canlendar = ({
  filteredEvents,
  view,
  handleSetView,
}: CalendarProps) => {
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const { currentDate, setCurrentDate } = currentDateStore();
  const { notifications, setNotifications } = notificationsStore();
  const { events, notifiedEvents, setNotifiedEvents } = eventsStore();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchHolidays = (year: number, month: number) => {
    // 실제로는 API를 호출하여 공휴일 정보를 가져와야 합니다.
    // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
    return {
      "2024-01-01": "신정",
      "2024-02-09": "설날",
      "2024-02-10": "설날",
      "2024-02-11": "설날",
      "2024-03-01": "삼일절",
      "2024-05-05": "어린이날",
      "2024-06-06": "현충일",
      "2024-08-15": "광복절",
      "2024-09-16": "추석",
      "2024-09-17": "추석",
      "2024-09-18": "추석",
      "2024-10-03": "개천절",
      "2024-10-09": "한글날",
      "2024-12-25": "크리스마스",
    };
  };

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  const checkUpcomingEvents = async () => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);

      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);

      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime &&
        !notifiedEvents.includes(event.id)
      );
    });

    for (const event of upcomingEvents) {
      try {
        setNotifications((prev) => [
          ...prev,
          {
            id: event.id,
            message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
          },
        ]);
        setNotifiedEvents((prev) => [...prev, event.id]);
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }
  };

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  useEffect(() => {
    if (events.length > 0) {
      checkUpcomingEvents();
    }
  }, [events]);

  return (
    <>
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
            onChange={(e) => handleSetView(e.target.value as "week" | "month")}
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

        {view === "week" && (
          <WeekView filteredEvents={filteredEvents} holidays={holidays} />
        )}
        {view === "month" && (
          <MonthView filteredEvents={filteredEvents} holidays={holidays} />
        )}
      </VStack>
      {notifications.length > 0 && <AlertNotificationToast />}
    </>
  );
};

type WeekViewProps = {
  filteredEvents: Event[];
  holidays: { [key: string]: string };
};

const WeekView = ({ filteredEvents, holidays }: WeekViewProps) => {
  const { currentDate } = currentDateStore();
  const { notifiedEvents } = eventsStore();

  const weekDates = getWeekDates(currentDate);
  return (
    <VStack
      role="weekView"
      data-testid="week-view"
      align="stretch"
      w="full"
      spacing={4}
    >
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
              >
                <Text fontWeight="bold">{date.getDate()}</Text>
                {filteredEvents
                  .filter(
                    (event) =>
                      new Date(event.date).toDateString() ===
                      date.toDateString()
                  )
                  .map((event) => {
                    const isNotified = notifiedEvents.includes(event.id);
                    return (
                      <Box
                        role="calendarItem"
                        key={event.id}
                        p={1}
                        my={1}
                        bg={isNotified ? "red.100" : "gray.100"}
                        borderRadius="md"
                        fontWeight={isNotified ? "bold" : "normal"}
                        color={isNotified ? "red.500" : "inherit"}
                      >
                        <HStack spacing={1}>
                          {isNotified && <BellIcon />}
                          <Text role="itemTitle" fontSize="sm" noOfLines={1}>
                            {event.title}
                          </Text>
                        </HStack>
                      </Box>
                    );
                  })}
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
};

type MonthViewProps = {
  filteredEvents: Event[];
  holidays: { [key: string]: string };
};

const MonthView = ({ filteredEvents, holidays }: MonthViewProps) => {
  const { currentDate } = currentDateStore();
  const { notifiedEvents } = eventsStore();

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
    <VStack
      role="monthView"
      data-testid="month-view"
      align="stretch"
      w="full"
      spacing={4}
    >
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
              {week.map((day, dayIndex) => {
                const dateString = day
                  ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  : "";
                const holiday = holidays[dateString];

                return (
                  <Td
                    key={dayIndex}
                    height="100px"
                    verticalAlign="top"
                    width="14.28%"
                    position="relative"
                  >
                    {day && (
                      <>
                        <Text fontWeight="bold">{day}</Text>
                        {holiday && (
                          <Text color="red.500" fontSize="sm">
                            {holiday}
                          </Text>
                        )}
                        {filteredEvents
                          .filter(
                            (event) => new Date(event.date).getDate() === day
                          )
                          .map((event) => {
                            const isNotified = notifiedEvents.includes(
                              event.id
                            );
                            return (
                              <Box
                                role="calendarItem"
                                key={event.id}
                                p={1}
                                my={1}
                                bg={isNotified ? "red.100" : "gray.100"}
                                borderRadius="md"
                                fontWeight={isNotified ? "bold" : "normal"}
                                color={isNotified ? "red.500" : "inherit"}
                              >
                                <HStack spacing={1}>
                                  {isNotified && <BellIcon />}
                                  <Text
                                    role="itemTitle"
                                    fontSize="sm"
                                    noOfLines={1}
                                  >
                                    {event.title}
                                  </Text>
                                </HStack>
                              </Box>
                            );
                          })}
                      </>
                    )}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};
