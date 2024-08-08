import { create } from "zustand";
import { Notification } from "../types";

type State = {
  notifications: Notification[];
};

type Action = {
  // setNotifications: (notifications: { id: number; message: string }[]) => void;
  setNotifications: (
    updater: Notification[] | ((prev: Notification[]) => Notification[])
  ) => void;
};

export const notificationsStore = create<State & Action>((set) => ({
  notifications: [],
  setNotifications: (updater) =>
    set((state) => ({
      notifications: Array.isArray(updater)
        ? updater
        : updater(state.notifications),
    })),
}));
