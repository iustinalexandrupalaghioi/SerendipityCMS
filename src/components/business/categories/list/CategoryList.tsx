import DataTable from "@/components/partials/data-table/DataTable";
import LoaderScreen from "@/components/ui/loader";
import { useCategories } from "@/hooks/useCategories";
import { Navigate } from "react-router-dom";
import { CategoryColumns } from "./CategoryColumns";

const CategoryList = () => {
  const { data, isLoading, error } = useCategories();

  return (
    <div className="w-full py-2">
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterTextColumns={["Name"]}
          filterTextPlaceholders={["Search by category name..."]}
          filterTextLabels={["Category name"]}
          columns={CategoryColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default CategoryList;
