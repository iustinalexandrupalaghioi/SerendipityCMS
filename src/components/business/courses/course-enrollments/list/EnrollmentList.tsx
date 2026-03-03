import DataTable from "@/components/partials/data-table/DataTable";
import LoaderScreen from "@/components/ui/loader";
import { useCourseEnrollments, useCourses } from "@/hooks/useCourses";
import type { Enum } from "@/types/EnumType";
import { Navigate, useParams } from "react-router-dom";
import { CourseEnrollmentColumns } from "./CourseEnrollmentColumns";
import AddCourseEnrollmentDialog from "../form/AddCourseEnrollmentDialog";
import type { EnrollmentStatus } from "@/types/Course";
import { useMemo } from "react";

const statusEnum: Enum[] = [
  { value: "submitted", label: "Submitted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const ongoingStatusEnum: Enum[] = [
  { value: "submitted", label: "Submitted" },
  { value: "confirmed", label: "Confirmed" },
];

const EnrollmentList = () => {
  const { status } = useParams();
  const { data: serviceCategories } = useCourses();

  // Prepare service categories for dropdown filter
  const coursesEnum: Enum[] = useMemo(() => {
    return (
      serviceCategories?.map((category) => ({
        value: category.title,
        label: category.title,
      })) ?? []
    );
  }, [serviceCategories]);
  const isOngoing = status === "ongoing";
  const enrollmentStatuses: EnrollmentStatus[] | undefined = isOngoing
    ? ["submitted", "confirmed"]
    : undefined;

  const { data, isLoading, error } = useCourseEnrollments(enrollmentStatuses);

  return (
    <div className="w-full py-2">
      <AddCourseEnrollmentDialog />
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && (
        <DataTable
          columns={CourseEnrollmentColumns}
          data={data || []}
          filterEnumColumns={["Status", "Course"]}
          filterEnumPlaceholders={["All", "All"]}
          filterEnumLabels={["Status", "Course"]}
          enums={[isOngoing ? ongoingStatusEnum : statusEnum, coursesEnum]}
        />
      )}
    </div>
  );
};

export default EnrollmentList;
