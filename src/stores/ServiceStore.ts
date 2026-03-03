import type { Service } from "@/types/Service";
import { create } from "zustand";

interface ServiceStore {
  selectedService: Service | null;
  setSelectedService: (Service: Service | null) => void;
  clearSelectedService: () => void;
}

const useServiceStore = create<ServiceStore>((set) => ({
  selectedService: null,
  setSelectedService: (category) => set({ selectedService: category }),
  clearSelectedService: () => set({ selectedService: null }),
}));

export default useServiceStore;
