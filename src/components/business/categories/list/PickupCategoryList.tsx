import DataTable from "@/components/partials/data-table/DataTable";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import Loader from "@/components/ui/loader";
import { useCategories } from "@/hooks/useCategories";
import useCategoryStore from "@/stores/CategoryStore";
import { type Dispatch, type SetStateAction } from "react";
import { Navigate } from "react-router";
import { PickupCategoryColumns } from "./PickupCategoryColumns";

interface LookupCategoryDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupCategoryDialog = ({ open, setOpen }: LookupCategoryDialogProps) => {
  const { data, error, isLoading } = useCategories();
  const { setSelectedCategory, selectedCategory } = useCategoryStore();

  return (
    <ActionDialog
      action="Save"
      open={open}
      setOpen={setOpen}
      title="Categories"
      description="Select a category from the list"
      className="md:max-w-4xl"
      isPending={isLoading}
      showFooter={false}
    >
      {isLoading && <Loader />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto px-2">
          <DataTable
            filterTextColumns={["Name"]}
            filterTextPlaceholders={["Search by category name..."]}
            columns={PickupCategoryColumns(setOpen)}
            data={data}
            setRowSelection={setSelectedCategory}
            rowSelection={selectedCategory}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default LookupCategoryDialog;
