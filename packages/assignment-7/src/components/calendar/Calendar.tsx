import React from "react";
import {Event} from "../../types/types.ts";
import {Heading, HStack, IconButton, Select, VStack} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import WeekCalendar from "./WeekCalendar.tsx";
import MonthCalendar from "./MonthCalendar.tsx";

interface EventCalenderProps {
    view: "week" | "month";
    setView: (view: "week" | "month") => void;
    navigate: (direction: "prev" | "next") => void;
    currentDate: Date;
    filteredEvents: Event[];
    notifiedEvents: number[];
    holidays: { [key: string]: string };
}

const Calendar: React.FC<EventCalenderProps> = ({
         view,
         setView,
         navigate,
        currentDate,
        filteredEvents,
        notifiedEvents,
        holidays,
     }) => {
    return(
        <VStack flex={1} spacing={5} align="stretch">
            <Heading>일정 보기</Heading>

            <HStack mx="auto" justifyContent="space-between">
                <IconButton
                    aria-label="Previous"
                    icon={<ChevronLeftIcon/>}
                    onClick={() => navigate('prev')}
                />
                <Select aria-label="view" value={view} onChange={(e) => setView(e.target.value as 'week' | 'month')}>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                </Select>
                <IconButton
                    aria-label="Next"
                    icon={<ChevronRightIcon/>}
                    onClick={() => navigate('next')}
                />
            </HStack>

            {view === 'week' && <WeekCalendar currentDate={currentDate} filteredEvents={filteredEvents} notifiedEvents={notifiedEvents} />}
            {view === 'month' && <MonthCalendar currentDate={currentDate} holidays={holidays} filteredEvents={filteredEvents} notifiedEvents={notifiedEvents} />}
        </VStack>
    )
}

export default Calendar;