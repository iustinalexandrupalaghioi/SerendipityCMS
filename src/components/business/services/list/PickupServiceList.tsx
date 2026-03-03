import useServiceStore from "@/stores/ServiceStore";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { Navigate } from "react-router";
import { PickupServiceColumns } from "./PickupServiceColumns";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import type { Enum } from "@/types/EnumType";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import Loader from "@/components/ui/loader";
import DataTable from "@/components/partials/data-table/DataTable";

interface PickupServiceDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const PickupServiceDialog = ({ open, setOpen }: PickupServiceDialogProps) => {
  const { data, error, isLoading } = useServices();
  const { setSelectedService, selectedService } = useServiceStore();
  const { data: serviceCategories } = useCategories();

  // Prepare service categories for dropdown filter
  const serviceCategoriesEnum: Enum[] = useMemo(() => {
    return (
      serviceCategories?.map((category) => ({
        value: category.name,
        label: category.name,
      })) ?? []
    );
  }, [serviceCategories]);

  const booleanEnum: Enum[] = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  return (
    <ActionDialog
      action="Save"
      open={open}
      setOpen={setOpen}
      title="Active Services"
      description="Select a service  from the list"
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
            filterTextPlaceholders={["Search by service name..."]}
            filterTextLabels={["Name"]}
            filterEnumColumns={["Category", "Popular"]}
            filterEnumPlaceholders={["All", "All"]}
            filterEnumLabels={["Category", "Popular"]}
            enums={[serviceCategoriesEnum, booleanEnum]}
            columns={PickupServiceColumns(setOpen)}
            data={data}
            setRowSelection={setSelectedService}
            rowSelection={selectedService}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default PickupServiceDialog;
