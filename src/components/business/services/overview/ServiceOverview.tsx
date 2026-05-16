import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { supabase } from "@/lib/supabaseClient";
import type { Service } from "@/types/Service";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import AddServiceDialog from "../form/AddServiceDialog";
import { UpdateServiceDialog } from "../form/UpdateServiceDialog";
import {
  createServiceColumns,
  serviceColumnVisibility,
} from "./ServiceColumns";
import { QUERY_KEY, useServices } from "./useServices";

export const SERVICES_OVERVIEW_KEY = "services-overview";

const deleteService = async (id: string) => {
  const { data: service, error: serviceError } = await supabase
    .from("service")
    .select("image_path")
    .eq("id", id)
    .single();

  if (serviceError) throw new Error("Failed to fetch service image");

  if (service?.image_path) {
    const { error: deleteErr } = await supabase.storage
      .from("services")
      .remove([service.image_path]);
    if (deleteErr) throw new Error("Failed to delete service image");
  }

  const { error: deleteServiceErr } = await supabase
    .from("service")
    .delete()
    .eq("id", id);

  if (deleteServiceErr) throw new Error("Failed to delete service");
};

const ServiceOverview = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(SERVICES_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(SERVICES_OVERVIEW_KEY),
  );
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const {
    allItems: services,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useServices(sorting, filters);

  const handleOpen = useCallback((rows: Row<Service>[]) => {
    const first = rows[0];
    if (first) setEditingService(first.original);
  }, []);

  const handleDelete = useCallback((rows: Row<Service>[]) => {
    const first = rows[0];
    if (first) setDeletingService(first.original);
  }, []);

  const columns = useMemo(
    () => createServiceColumns(handleOpen, handleDelete),
    [handleOpen, handleDelete],
  );

  const selectedRows = useMemo(
    () => services.filter((row) => rowSelection[row.id]),
    [services, rowSelection],
  );

  const handleFiltersChange = useCallback((newFilters: FilterRule[]) => {
    setFilters(newFilters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading services</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDelete(rows.map((r) => ({ original: r }) as Row<Service>))
        }
        setRowSelection={setRowSelection}
      />

      <DataTable
        isLoading={isLoading}
        defaultViewName="Services"
        tableId={SERVICES_OVERVIEW_KEY}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        getRowId={(row) => row.id}
        totalCount={total}
        columns={columns}
        data={services}
        initialColumnVisibility={serviceColumnVisibility}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
      />

      <AddServiceDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingService && (
        <UpdateServiceDialog
          open={!!editingService}
          setOpen={(o) => !o && setEditingService(null)}
          service={editingService}
        />
      )}

      {deletingService && (
        <DeleteDialog
          open={!!deletingService}
          setOpen={(o) => !o && setDeletingService(null)}
          id={deletingService.id}
          title="Delete Service"
          target="service"
          queryKeys={[QUERY_KEY]}
          deleteFn={() => deleteService(deletingService.id)}
          confirmationMessage={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingService.title}</span>?{" "}
              <br /> This action cannot be undone.
            </>
          }
        />
      )}
    </div>
  );
};

export default ServiceOverview;
