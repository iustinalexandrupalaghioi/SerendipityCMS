import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CourseDay } from "@/types/Course";
import { CalendarDaysIcon } from "lucide-react";
import CourseDayActivitiesOverview from "../course-day-activities/nav-overview/ActivityOverview";

interface CourseDayTabsProps {
  courseDay: CourseDay;
  isOpen?: boolean;
}
const CourseDayTabs = ({ courseDay, isOpen }: CourseDayTabsProps) => {
  return (
    <Tabs defaultValue="activities" className="w-full gap-0 mt-2">
      <TabsList className="w-full rounded-b-none justify-start bg-card">
        <TabsTrigger
          title="Day activities tab"
          className="max-w-fit"
          value="activities"
        >
          <CalendarDaysIcon /> Day activities
        </TabsTrigger>
      </TabsList>
      <TabsContent className="bg-card rounded-b-lg p-3" value="activities">
        <CourseDayActivitiesOverview
          slotId="course-day-activities-toolbar-slot"
          courseDay={courseDay}
          isOpen={isOpen}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CourseDayTabs;
