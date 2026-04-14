import DataTable from "@/components/partials/data-table/DataTable";
import type { Course } from "@/types/Course";
import type { Enum } from "@/types/EnumType";
import { CourseEnrollmentColumns } from "./CourseEnrollmentColumns";
import AddCourseEnrollmentDialog from "../form/AddCourseEnrollmentDialog";

interface CourseEnrollmentListProps {
  course: Course;
}

const statusEnum: Enum[] = [
  { value: "submitted", label: "Submitted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "canceled", label: "Canceled" },
  { value: "completed", label: "Completed" },
];

const CourseEnrollmentList = ({ course }: CourseEnrollmentListProps) => {
  return (
    <div className="w-full overflow-x-auto py-2">
      {course.is_open && <AddCourseEnrollmentDialog course={course} />}
      <DataTable
        columns={CourseEnrollmentColumns}
        data={course.course_enrollment ?? []}
        filterEnumColumns={["Status"]}
        filterEnumPlaceholders={["All"]}
        filterEnumLabels={["Status"]}
        enums={[statusEnum]}
      />
    </div>
  );
};

export default CourseEnrollmentList;
