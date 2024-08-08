import { Event } from "../App";
import { getNextDate } from "../utils/getNextDate";

interface GetRepeatedEventProps {
  event: Event;
  startDate: Date;
  endDate: Date;
}

export const getRepeatedEvents = ({
  event,
  startDate,
  endDate,
}: GetRepeatedEventProps): Event[] => {
  const eventDate = new Date(event.date);
  const initialDate = new Date(
    Math.max(eventDate.getTime(), startDate.getTime())
  );

  const createRepeatedEvent = (date: Date): Event => ({
    ...event,
    id: Date.now(),
    date: date.toISOString().split("T")[0],
  });

  const generateEvents = (currentDate: Date, acc: Event[]): Event[] => {
    if (currentDate > endDate) {
      return acc;
    }

    if (event.repeat.endDate && new Date(event.repeat.endDate) < currentDate) {
      return acc;
    }

    if (event.repeat.type === "none") {
      return currentDate.toDateString() === eventDate.toDateString()
        ? [...acc, createRepeatedEvent(currentDate)]
        : acc;
    }

    const newAcc = [...acc, createRepeatedEvent(currentDate)];
    const nextDate = getNextDate({
      date: currentDate,
      repeatType: event.repeat.type,
    });

    return generateEvents(nextDate, newAcc);
  };

  return generateEvents(initialDate, []);
};
