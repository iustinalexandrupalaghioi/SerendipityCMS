import type { Category } from "@/types/Category";
import { create } from "zustand";

interface CategoryStore {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  clearSelectedCategory: () => void;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearSelectedCategory: () => set({ selectedCategory: null }),
}));

export default useCategoryStore;
