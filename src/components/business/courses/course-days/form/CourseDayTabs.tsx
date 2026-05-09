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
      <div className="overflow-x-auto">
        <TabsList className="w-max min-w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-1 gap-1">
          <TabsTrigger
            title="Day activities tab"
            className="max-w-fit"
            value="activities"
          >
            <CalendarDaysIcon /> Day activities
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent className="mt-0 pt-3" value="activities">
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
