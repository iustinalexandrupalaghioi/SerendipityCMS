import type { CourseSession } from "@/types/Course";
import { create } from "zustand";

interface CourseSessionStore {
  selectedCourseSession: CourseSession | null;
  setselectedCourseSession: (course: CourseSession | null) => void;
  clearselectedCourseSession: () => void;
}

const useCourseSessionStore = create<CourseSessionStore>((set) => ({
  selectedCourseSession: null,
  setselectedCourseSession: (course) => set({ selectedCourseSession: course }),
  clearselectedCourseSession: () => set({ selectedCourseSession: null }),
}));

export default useCourseSessionStore;
