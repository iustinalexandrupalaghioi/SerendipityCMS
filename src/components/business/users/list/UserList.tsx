import DataTable from "@/components/partials/data-table/DataTable";
import LoaderScreen from "@/components/ui/loader";
import { Navigate } from "react-router-dom";
import { UserColumns } from "./UserColumns";
import { useUserProfiles } from "@/hooks/useUsers";

const UserList = () => {
  const { data, isLoading, error } = useUserProfiles();

  return (
    <div className="w-full py-2">
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterTextColumns={["Name"]}
          filterTextPlaceholders={["Search by user name..."]}
          filterTextLabels={["User name"]}
          columns={UserColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default UserList;
