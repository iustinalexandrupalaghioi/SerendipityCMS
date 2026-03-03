import DataTable from "@/components/partials/data-table/DataTable";
import type { CourseDay } from "@/types/Course";
import AddCourseDayActivityDialog from "../form/AddCourseDayActivityDialog";
import { CourseDayActivityColumns } from "./CourseDayActivityColumns";

interface CourseDayActivitiesListProps {
  courseDay: CourseDay;
}

const CourseDayActivitiesList = ({
  courseDay,
}: CourseDayActivitiesListProps) => {
  return (
    <div className="w-full py-2">
      <AddCourseDayActivityDialog />

      <DataTable
        columns={CourseDayActivityColumns(courseDay)}
        data={courseDay.course_day_activity || []}
      />
    </div>
  );
};

export default CourseDayActivitiesList;
