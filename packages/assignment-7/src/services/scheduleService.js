let schedules = [];
let notifications = [];
const holidays = [
  { date: '2024-01-01', name: '신정' },
  { date: '2024-05-05', name: '어린이날' }
];

export const createSchedule = (schedule) => {
  schedules.push(schedule);
  return schedule;
};

export const updateSchedule = (id, updatedSchedule) => {
  schedules = schedules.map(sch => sch.id === id ? updatedSchedule : sch);
  return updatedSchedule;
};

export const deleteSchedule = (id) => {
  schedules = schedules.filter(sch => sch.id !== id);
};

export const getSchedules = () => schedules;

export const getScheduleById = (id) => schedules.find(sch => sch.id === id);

export const setNotification = (scheduleId, time) => {
  notifications.push({ scheduleId, time });
};

export const getNotificationByScheduleId = (scheduleId) => notifications.find(notif => notif.scheduleId === scheduleId);

export const searchSchedules = (query) => schedules.filter(sch => sch.title.includes(query));

export const getHolidays = () => holidays;

export const checkConflict = (schedule) => {
  return schedules.some(sch => sch.id !== schedule.id && sch.date === schedule.date && sch.time === schedule.time);
};

export const clearSchedules = () => {
  schedules = [];
};
