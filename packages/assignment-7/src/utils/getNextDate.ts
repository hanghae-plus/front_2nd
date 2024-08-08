import { REPEAT_TYPE, RepeatType } from "../constants/date";
import { addMonths } from "./addMonths";

interface GetNextDateProps {
  date: Date;
  repeatType: RepeatType;
}

export const getNextDate = ({ date, repeatType }: GetNextDateProps): Date => {
  switch (repeatType) {
    case REPEAT_TYPE.DAILY:
      return new Date(date.getTime() + 24 * 60 * 60 * 1000);
    case REPEAT_TYPE.WEEKLY:
      return new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    case REPEAT_TYPE.MONTHLY:
      return addMonths(date, 1);
    case REPEAT_TYPE.YEARLY:
      return addMonths(date, 12);
    default:
      return new Date(date);
  }
};
