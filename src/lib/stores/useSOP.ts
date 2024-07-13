import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SOPState {
  regulationsText: string;
  SOPItems: { name: string, id: number }[];
  SOPName: string;
  setRegulationsText: (regulationsText: string) => void;
  setSOPItems: (SOPItems: { name: string, id: number }[]) => void;
  setSOPName: (SOPName: string) => void;
}

export const useSOPStore = create<SOPState>()(
  persist(
    (set) => ({
      regulationsText: "",
      SOPItems: [],
      SOPName: "",
      setRegulationsText: (regulationsText: string) => set({ regulationsText }),
      setSOPItems: (SOPItems: { name: string, id: number }[]) => set({ SOPItems }),
      setSOPName: (SOPName: string) => set({ SOPName })
    }),
    {
      name: "regulations-text-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
