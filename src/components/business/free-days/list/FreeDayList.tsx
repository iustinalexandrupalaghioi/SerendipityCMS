import DataTable from "@/components/partials/data-table/DataTable";
import LoaderScreen from "@/components/ui/loader";
import { useFreeDays } from "@/hooks/useFreeDays";
import { Navigate } from "react-router-dom";
import { FreeDayColumns } from "./FreeDayColumns";
import { AddFreeDayDialog } from "../form/AddFreeDayDialog";

const FreeDayList = () => {
  const { data, isLoading, error } = useFreeDays();

  return (
    <div className="w-full py-2">
      <AddFreeDayDialog />
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable columns={FreeDayColumns} data={data} />
      )}
    </div>
  );
};

export default FreeDayList;
