import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SOPState {
  regulationsText: string;
  setRegulationsText: (regulationsText: string) => void;
}

export const useSOPStore = create<SOPState>()(
  persist(
    (set) => ({
      regulationsText: "",
      setRegulationsText: (regulationsText: string) => set({ regulationsText }),
    }),
    {
      name: "regulations-text-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
