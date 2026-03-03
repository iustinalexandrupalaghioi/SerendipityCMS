import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/types/Course";
import { BookCheckIcon, CalendarDaysIcon } from "lucide-react";
import CourseDayList from "../course-days/list/CourseDayList";
import CourseEnrollmentList from "../course-enrollments/list/CourseEnrollmentList";

interface CourseTabsProps {
  course: Course;
}
const CourseTabs = ({ course }: CourseTabsProps) => {
  return (
    <Tabs defaultValue="days" className="w-full gap-0 mt-2">
      <TabsList className="w-full rounded-b-none justify-start bg-card">
        <TabsTrigger title="Course days tab" className="max-w-fit" value="days">
          <CalendarDaysIcon /> Course days
        </TabsTrigger>
        <TabsTrigger
          title="Course enrollments tab"
          className="max-w-fit"
          value="enrollments"
        >
          <BookCheckIcon /> Course enrollments
        </TabsTrigger>
      </TabsList>
      <TabsContent className="bg-card rounded-b-lg p-3" value="days">
        <CourseDayList course={course} />
      </TabsContent>
      <TabsContent className="bg-card rounded-b-lg p-3" value="enrollments">
        <CourseEnrollmentList course={course} />
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabs;
