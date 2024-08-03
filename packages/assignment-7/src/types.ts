export type Event = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatSetting;
  notificationTime: number;
};

export type RepeatSetting = {
  type: string;
  interval: number;
};
