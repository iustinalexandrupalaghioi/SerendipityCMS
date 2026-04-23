import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/types/Course";
import { BookCheckIcon, CalendarDaysIcon } from "lucide-react";
import CourseDayOverview from "../course-days/nav-overview/CourseDayOverview";
import EnrollmentOverview from "../course-enrollments/nav-overview/EnrollmentOverview";

interface CourseTabsProps {
  course: Course;
  isOpen?: boolean;
}

const CourseTabs = ({ course, isOpen }: CourseTabsProps) => {
  return (
    <Tabs defaultValue="days" className="w-full gap-0 mt-2">
      <div className="overflow-x-auto">
        <TabsList className="w-max min-w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-1 gap-1">
          <TabsTrigger title="Course days tab" value="days">
            <CalendarDaysIcon className="size-4" /> Course days
          </TabsTrigger>
          <TabsTrigger title="Course enrollments tab" value="enrollments">
            <BookCheckIcon className="size-4" /> Course enrollments
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent className="mt-0 pt-3" value="days">
        <CourseDayOverview
          slotId="course-days-toolbar-slot"
          course={course}
          isOpen={isOpen}
        />
      </TabsContent>
      <TabsContent className="mt-0 pt-3" value="enrollments">
        <EnrollmentOverview
          slotId="course-enrollments-toolbar-slot"
          course={course}
          isOpen={isOpen}
        />
      </TabsContent>
    </Tabs>
  );
};
export default CourseTabs;
