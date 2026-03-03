import DataTable from "@/components/partials/data-table/DataTable";
import LoaderScreen from "@/components/ui/loader";
import { useCourses } from "@/hooks/useCourses";
import { Navigate } from "react-router-dom";
import { CourseColumns } from "./CourseColumns";
import AddButton from "@/components/partials/dialog/AddButton";

const CourseList = () => {
  const { data, isLoading, error } = useCourses();

  return (
    <div className="w-full py-2">
      <AddButton path="/courses/add" />
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable columns={CourseColumns} data={data} />
      )}
    </div>
  );
};

export default CourseList;
