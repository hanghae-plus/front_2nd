import dayjs = require("dayjs");

export const NO_EVENT_TEXT = '검색 결과가 없습니다.'
export const NEW_DATE = dayjs().format('YYYY-MM-DD');
export const START_TIME = dayjs().add(1, 'minute').format('HH:mm');
export const END_TIME = dayjs().add(2, 'minute').format('HH:mm');