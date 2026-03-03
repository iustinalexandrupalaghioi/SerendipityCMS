import DataTable from "@/components/partials/data-table/DataTable";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import Loader from "@/components/ui/loader";
import { useUserProfiles } from "@/hooks/useUsers";
import useUserStore from "@/stores/UserStore";
import type { Dispatch, SetStateAction } from "react";
import { Navigate } from "react-router";
import { PickupUserColumns } from "./PickupUserColumns";

interface PickupUserListProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const PickupUserList = ({ open, setOpen }: PickupUserListProps) => {
  const { data, error, isLoading } = useUserProfiles();
  const { selectedUser, setSelectedUser } = useUserStore();

  return (
    <ActionDialog
      open={open}
      setOpen={setOpen}
      title="Customers"
      description="Select a customer from the list"
      className="md:max-w-7xl max-h-[90vh] overflow-y-auto"
      isPending={isLoading}
      showFooter={false}
    >
      {isLoading && <Loader className="max-h-48" />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto px-2">
          <DataTable
            filterTextColumns={["Customer name", "Email address"]}
            filterTextPlaceholders={[
              "Search by customer name...",
              "Search by customer email...",
            ]}
            filterTextLabels={["Customer name", "Customer email"]}
            columns={PickupUserColumns(setOpen)}
            data={data}
            setRowSelection={setSelectedUser}
            rowSelection={selectedUser}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default PickupUserList;
