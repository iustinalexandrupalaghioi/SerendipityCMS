import type { Course } from "@/types/Course";
import { create } from "zustand";

interface CourseStore {
  selectedCourse: Course | null;
  setselectedCourse: (course: Course | null) => void;
  clearselectedCourse: () => void;
}

const useCourseStore = create<CourseStore>((set) => ({
  selectedCourse: null,
  setselectedCourse: (course) => set({ selectedCourse: course }),
  clearselectedCourse: () => set({ selectedCourse: null }),
}));

export default useCourseStore;
