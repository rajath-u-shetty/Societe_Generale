import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SOPState {
  regulationsText: string;
  SOPItems: { name: string, id: number }[];
  setRegulationsText: (regulationsText: string) => void;
  setSOPItems: (SOPItems: { name: string, id: number }[]) => void;
}

export const useSOPStore = create<SOPState>()(
  persist(
    (set) => ({
      regulationsText: "",
      SOPItems: [],
      setRegulationsText: (regulationsText: string) => set({ regulationsText }),
      setSOPItems: (SOPItems: { name: string, id: number }[]) => set({ SOPItems }),
    }),
    {
      name: "regulations-text-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
