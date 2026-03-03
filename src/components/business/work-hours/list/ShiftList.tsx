import LoaderScreen from "@/components/ui/loader";
import { Navigate } from "react-router-dom";
import DataTable from "@/components/partials/data-table/DataTable";
import { ShiftColumns } from "./ShiftColumns";
import { useShifts } from "@/hooks/useShifts";
import { AddShiftDialog } from "../form/AddShiftDialog";

const ShiftList = () => {
  const { data, isLoading, error } = useShifts();

  return (
    <div className="w-full py-2">
      <AddShiftDialog />
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable columns={ShiftColumns} data={data} />
      )}
    </div>
  );
};

export default ShiftList;
