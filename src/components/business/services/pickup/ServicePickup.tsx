import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import type { Service } from "@/types/Service";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { useServices } from "../overview/useServices";
import {
  createPickupServiceColumns,
  pickupServiceColumnVisibility,
} from "./ServicePickupColumns";

export const PICKUP_SERVICE_KEY = "pickup-service";

interface ServicePickupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (service: Service) => void;
}

const ServicePickup = ({ open, setOpen, onSelect }: ServicePickupProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(PICKUP_SERVICE_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(PICKUP_SERVICE_KEY),
  );

  const { data, isLoading, isError } = useServices(sorting, filters);

  const services = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleSelect = useCallback(
    (service: Service) => {
      onSelect(service);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  const columns = useMemo(
    () => createPickupServiceColumns(handleSelect),
    [handleSelect],
  );

  const handleFiltersChange = useCallback((newFilters: FilterRule[]) => {
    setFilters(newFilters);
    setRowSelection({});
  }, []);

  return (
    <ActionDialog
      open={open}
      setOpen={setOpen}
      title="Active Services"
      description="Select a service from the list"
      className="md:max-w-7xl max-w-screen max-h-[90vh] overflow-y-auto"
      isPending={isLoading}
      showFooter={false}
    >
      {isError ? (
        <div>Error loading services</div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full flex-col">
          <DataTable
            tableId={PICKUP_SERVICE_KEY}
            defaultViewName="Services"
            isLoading={isLoading}
            data={services}
            columns={columns}
            totalCount={total}
            getRowId={(row) => row.id}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            initialColumnVisibility={pickupServiceColumnVisibility}
            onSortingChange={setSorting}
            onFiltersChange={handleFiltersChange}
            isFetchingNextPage={false}
            hasNextPage={false}
            fetchNextPage={() => {}}
            height={550}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default ServicePickup;
