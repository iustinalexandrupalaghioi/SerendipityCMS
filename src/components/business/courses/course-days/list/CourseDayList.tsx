import DataTable from "@/components/partials/data-table/DataTable";
import AddButton from "@/components/partials/dialog/AddButton";
import type { Course } from "@/types/Course";
import { CourseDayColumns } from "./CourseDayColumns";

interface CourseDayListProps {
  course: Course;
}

const CourseDayList = ({ course }: CourseDayListProps) => {
  return (
    <div className="w-full overflow-x-auto py-2">
      <AddButton path={`/courses/update/${course.id}/course-days/add`} />

      <DataTable columns={CourseDayColumns} data={course.course_day || []} />
    </div>
  );
};

export default CourseDayList;
