import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CourseDay } from "@/types/Course";
import { CalendarDaysIcon } from "lucide-react";
import CourseDayActivitiesList from "../course-day-activities/list/CourseDayActivityList";

interface CourseDayTabsProps {
  courseDay: CourseDay;
}
const CourseDayTabs = ({ courseDay }: CourseDayTabsProps) => {
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
        <CourseDayActivitiesList courseDay={courseDay} />
      </TabsContent>
    </Tabs>
  );
};

export default CourseDayTabs;
