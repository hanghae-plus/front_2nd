import { weekDays } from "../../App";
import RenderWeekView from "../RenderWeekView";
import events from "./events.json";
import repeatEvents from "./repeat-events.json";

export default {
  title: "달력 주간 뷰",
  component: RenderWeekView,
  argTypes: {
    currentDate: new Date("2024-08-01"),
    filteredEvents: events,
    weekDays: weekDays,
    notifiedEvents: [],
  },
};

export const Default = {
  name: "기본",
  args: {
    currentDate: new Date("2024-08-01"),
    filteredEvents: events,
    weekDays: weekDays,
    notifiedEvents: [],
  },
};

export const RepeatEvents = {
  name: "반복 일정(Rust 스터디)이 있는 경우",
  args: {
    currentDate: new Date("2024-08-01"),
    filteredEvents: repeatEvents,
    weekDays: weekDays,
    notifiedEvents: [],
  },
};
