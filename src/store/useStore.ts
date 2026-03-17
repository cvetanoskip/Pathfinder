import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Activity {
  id: string;
  date: string;
  distance: number;
  duration: number;
  pace: number | null;
  steps: number;
  coordinates: { latitude: number; longitude: number }[];
}

interface Store {
  activities: Activity[];
  strideLength: number;
  setStrideLength: (length: number) => void;
  addActivity: (activity: Omit<Activity, "id">) => void;
  deleteActivity: (id: string) => void;
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      activities: [],
      strideLength: 0.762,
      setStrideLength: (length) => set({ strideLength: length }),
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            ...state.activities,
            { ...activity, id: Date.now().toString() },
          ],
        })),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),
    }),
    {
      name: "pathfinder-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
