import DataTable from "@/components/partials/data-table/DataTable";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import Loader from "@/components/ui/loader";
import { useCourses } from "@/hooks/useCourses";
import useCourseStore from "@/stores/CourseStore";
import { type Dispatch, type SetStateAction } from "react";
import { Navigate } from "react-router";
import { PickupCourseColumns } from "./PickupCourseColumns";

interface PickupCourseDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const PickupCourseDialog = ({ open, setOpen }: PickupCourseDialogProps) => {
  const { data, error, isLoading } = useCourses({
    isOpen: true,
  });
  const { setselectedCourse, selectedCourse } = useCourseStore();

  return (
    <ActionDialog
      action="Save"
      open={open}
      setOpen={setOpen}
      title="Courses"
      description="Select a course  from the list"
      className="md:max-w-7xl max-w-screen max-h-[90vh] overflow-y-auto"
      isPending={isLoading}
      showFooter={false}
    >
      {isLoading && <Loader className="max-h-48" />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto px-2">
          <DataTable
            filterTextColumns={["Name"]}
            filterTextPlaceholders={["Search by course name..."]}
            filterTextLabels={["Name"]}
            columns={PickupCourseColumns(setOpen)}
            data={data}
            setRowSelection={setselectedCourse}
            rowSelection={selectedCourse}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default PickupCourseDialog;
