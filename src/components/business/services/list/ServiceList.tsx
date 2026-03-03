import DataTable from "@/components/partials/data-table/DataTable";
import Loader from "@/components/ui/loader";
import { useCategories } from "@/hooks/useCategories";
import { useServices } from "@/hooks/useServices";
import type { Enum } from "@/types/EnumType";
import { useMemo } from "react";
import { Navigate } from "react-router";
import { ServiceColumns } from "./ServiceColumns";
import AddServiceDialog from "../form/AddServiceDialog";

const booleanEnum: Enum[] = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const ServiceList = () => {
  const { data, isLoading, error } = useServices();
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

  return (
    <div className="w-full py-2">
      <AddServiceDialog />
      {isLoading && <Loader />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterTextColumns={["Name"]}
          filterTextPlaceholders={["Search by service name..."]}
          filterTextLabels={["Service name"]}
          filterEnumColumns={["Category", "Active", "Popular"]}
          filterEnumPlaceholders={["All", "All", "All"]}
          filterEnumLabels={["Category", "Active", "Popular"]}
          enums={[serviceCategoriesEnum, booleanEnum, booleanEnum]}
          columns={ServiceColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default ServiceList;
