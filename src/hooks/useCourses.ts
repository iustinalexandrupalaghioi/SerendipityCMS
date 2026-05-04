import { supabase } from "@/lib/supabaseClient";
import type {
  Course,
  CourseDay,
  Enrollment,
  EnrollmentStatus,
} from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export interface CourseFilters {
  isOpen?: boolean;
}

const fetchCourses = async (filters?: CourseFilters): Promise<Course[]> => {
  let query = supabase
    .from("course")
    .select("*, course_day(*, course_day_activity(*)), course_enrollment(*)")
    .order("created_at", { ascending: false });
  if (typeof filters?.isOpen === "boolean") {
    query = query.eq("is_open", filters.isOpen);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching appointments:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: () => fetchCourses(filters),
    staleTime: 1000 * 60 * 5,
    select: (courses: Course[]) =>
      courses.map((course) => {
        const { data } = supabase.storage
          .from("courses")
          .getPublicUrl(course.image_path);

        return {
          ...course,
          image_url: data.publicUrl,
        };
      }),
  });
};

const fetchCourse = async (id: string): Promise<Course> => {
  const { data, error } = await supabase
    .from("course")
    .select(
      "*, course_day(*, course_day_activity(*)), course_session(*, course_enrollment(*, profile(*)), course(*))",
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course data:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCourse = (id?: string) => {
  if (!id) {
    throw new Error("Course ID is required");
  }

  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (course: Course) => {
      // Course image
      const courseImage = course.image_path
        ? supabase.storage.from("courses").getPublicUrl(course.image_path).data
            .publicUrl
        : "";

      // Course days images
      const courseDaysWithImages = course.course_day?.map((day: CourseDay) => {
        if (!day.image_path) return day;

        const { data } = supabase.storage
          .from("courses")
          .getPublicUrl(day.image_path);

        return {
          ...day,
          image_url: data.publicUrl,
        };
      });

      return {
        ...course,
        image_url: courseImage,
        course_day: courseDaysWithImages,
      };
    },
  });
};

const fetchCourseDay = async (id: string): Promise<CourseDay> => {
  const { data, error } = await supabase
    .from("course_day")
    .select(
      `
      *,
      course (*),
      course_day_activity (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course day data:", error);
    throw new Error(error.message);
  }

  return data;
};

export const useCourseDay = (id?: string) => {
  return useQuery({
    queryKey: ["course-day", id],
    queryFn: () => fetchCourseDay(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (courseDay: CourseDay) => {
      if (!courseDay.image_path) {
        return { ...courseDay, image_url: "" };
      }

      const { data } = supabase.storage
        .from("courses")
        .getPublicUrl(courseDay.image_path);

      return {
        ...courseDay,
        image_url: data.publicUrl,
      };
    },
  });
};

const fetchCourseEnrollmentsCount = async (): Promise<number> => {
  let query = supabase
    .from("course_enrollment")
    .select("id", { count: "exact", head: true })
    .in("status", ["submitted", "confirmed"]);

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching course enrollments count:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const useCourseEnrollmentsCount = () => {
  return useQuery({
    queryKey: ["course_enrollments_count"],
    queryFn: fetchCourseEnrollmentsCount,
    staleTime: 1000 * 60 * 5,
  });
};

const fetchCourseEnrollments = async (
  status?: EnrollmentStatus[],
): Promise<Enrollment[]> => {
  let query = supabase
    .from("course_enrollment")
    .select("*, course(*), profile(*)");

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching course enrollments:", error);
    throw new Error(error.message);
  }

  return data;
};

export const useCourseEnrollments = (status?: EnrollmentStatus[]) => {
  return useQuery({
    queryKey: ["course_enrollments", status],
    queryFn: () => fetchCourseEnrollments(status),
    staleTime: 1000 * 60 * 5,
  });
};
