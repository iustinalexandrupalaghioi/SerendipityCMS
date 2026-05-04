import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/types/Course";
import {
  BookCheckIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
} from "lucide-react";
import CourseDayOverview from "../course-days/nav-overview/CourseDayOverview";
import EnrollmentOverview from "../course-enrollments/nav-overview/EnrollmentOverview";
import CourseSessionOverview from "../course-sessions/nav-overview/CourseSessionOverview";

interface CourseTabsProps {
  course: Course;
  isOpen?: boolean;
}

const CourseTabs = ({ course, isOpen }: CourseTabsProps) => {
  return (
    <Tabs defaultValue="sessions" className="w-full gap-0 mt-2">
      <div className="overflow-x-auto">
        <TabsList className="w-max min-w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-1 gap-1">
          <TabsTrigger title="Course sessions tab" value="sessions">
            <CalendarClockIcon className="size-4" /> Sessions
          </TabsTrigger>
          <TabsTrigger title="Course enrollments tab" value="enrollments">
            <BookCheckIcon className="size-4" /> Enrollments
          </TabsTrigger>
          <TabsTrigger title="Course days tab" value="days">
            <CalendarDaysIcon className="size-4" /> Days
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
      <TabsContent className="mt-0 pt-3" value="sessions">
        <CourseSessionOverview
          slotId="course-sessions-toolbar-slot"
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
