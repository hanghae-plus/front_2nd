import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  getScheduleById,
  getNotificationByScheduleId,
  setNotification,
  searchSchedules,
  getHolidays,
  checkConflict,
  clearSchedules
} from '../services/scheduleService';


  export const ScheduleApp = {
    create: (schedule) => createSchedule(schedule),
    update: (id, updatedSchedule) => updateSchedule(id, updatedSchedule),
    delete: (id) => deleteSchedule(id),
    getAll: () => getSchedules(),
    getById: (id) => getScheduleById(id),
    setNotification: (scheduleId, time) => setNotification(scheduleId, time),
    getNotificationByScheduleId: (scheduleId) => getNotificationByScheduleId(scheduleId),
    search: (query) => searchSchedules(query),
    getHolidays: () => getHolidays(),
    checkConflict: (schedule) => checkConflict(schedule),
    clear: () => clearSchedules()
  };
  