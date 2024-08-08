import { create } from "zustand";

type State = {
  currentDate: Date;
};

type Action = {
  // setCurrentDate: (currentDate: Date) => void;
  setCurrentDate: (updater: Date | ((prevDate: Date) => Date)) => void;
  initializeForTest: (testDate: Date) => void;
};

export const currentDateStore = create<State & Action>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (updater) =>
    set((state) => ({
      currentDate:
        updater instanceof Date ? updater : updater(state.currentDate),
    })),
  initializeForTest: (testDate: Date) => set({ currentDate: testDate }),
}));
