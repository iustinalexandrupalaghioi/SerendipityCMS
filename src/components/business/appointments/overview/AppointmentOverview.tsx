import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import Breadcrumb from "@/components/partials/Breadcrumb";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { supabase } from "@/lib/supabaseClient";
import { isAppointmentStatus } from "@/lib/utils";
import type { Appointment } from "@/types/Appointment";
import { useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { addDays, format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import DeclineAppointmentDialog from "../actions/decline/DeclineAppointmentDialog";
import UpdateAndAcceptDialog from "../actions/update-and-accept/UpdateAndAcceptDialog";
import { AppointmentAddDialog } from "../form/AppointmentAddDialog";
import AppointmentUpdateDialog from "../form/AppointmentUpdateDialog";
import {
  appointmentColumnVisibility,
  createAppointmentColumns,
} from "./AppointmentColumns";
import { useAppointmentActions } from "./useAppointmentActions";
import { appointmentKeys, useAppointments } from "./useAppointments";

export const APPOINTMENTS_OVERVIEW_KEY = "appointments-overview";

const TODAY_START = new Date();
TODAY_START.setHours(0, 0, 0, 0);
const TODAY_END = new Date();
TODAY_END.setHours(23, 59, 59, 999);

const LABEL_MAP: Record<string, string> = {
  appointments: "Appointments",
  confirmed: "Confirmed",
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled",
};

const AppointmentOverview = () => {
  const queryClient = useQueryClient();
  const { status } = useParams();
  const [searchParams] = useSearchParams();
  const day = searchParams.get("day");

  if (status && !isAppointmentStatus(status)) {
    toast.error("Invalid appointment status");
    return <Navigate to="/" />;
  }

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(APPOINTMENTS_OVERVIEW_KEY),
  );

  const isToday = day === "today";
  const isTomorrow = day === "tomorrow";

  const preFilters = useMemo<FilterRule[]>(() => {
    const pre: FilterRule[] = [];

    if (status) {
      pre.push({
        columnId: "status",
        columnType: "select",
        columnName: "Status",
        operator: "equals",
        value: status,
      });
    }

    if (isToday) {
      pre.push({
        columnId: "date",
        columnType: "date",
        columnName: "Date",
        operator: "equals",
        value: format(new Date(), "yyyy-MM-dd"),
      });
    }

    if (isTomorrow) {
      pre.push({
        columnId: "date",
        columnType: "date",
        columnName: "Date",
        operator: "equals",
        value: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      });
    }

    return pre;
  }, [status, isToday, isTomorrow]);

  // Keep filters state only for the query — but initialise it simply:
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(APPOINTMENTS_OVERVIEW_KEY),
  );

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] =
    useState<Appointment | null>(null);
  const [updateAndAcceptAppointment, setUpdateAndAcceptAppointment] =
    useState<Appointment | null>(null);
  const [decliningAppointment, setDecliningAppointment] =
    useState<Appointment | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    allItems: appointments,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAppointments(sorting, [...preFilters, ...filters]);

  const DAY_LABEL_MAP: Record<string, string> = {
    today: "Today",
    tomorrow: "Tomorrow",
  };

  const breadcrumbItems = useMemo(() => {
    const pathnames = location.pathname.split("/").filter(Boolean);

    const crumbs = pathnames.map((segment, index) => ({
      path: "/" + pathnames.slice(0, index + 1).join("/"),
      label:
        LABEL_MAP[segment] ??
        segment.charAt(0).toUpperCase() + segment.slice(1),
    }));

    const items = [{ path: "/", label: "Home" }, ...crumbs];

    if (day) {
      items.push({ path: "", label: DAY_LABEL_MAP[day] ?? day });
    }

    return items;
  }, [location.pathname, day]);

  const handleAccept = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.functions.invoke(
          "accept-appointment",
          {
            body: { id, action_type: "accept_appointment" },
          },
        );

        if (error) {
          const body = await error?.context?.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to accept appointment.");
        }

        toast.success("Appointment successfully accepted.");
        queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.count({ status: "pending" }),
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to accept appointment.");
      }
    },
    [queryClient],
  );

  const handleComplete = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("appointment")
          .update({ status: "completed" })
          .eq("id", id);
        if (error) throw error;
        toast.success("Appointment successfully completed.");
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({
          queryKey: ["appointments_count", "pending"],
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to complete appointment.");
      }
    },
    [queryClient],
  );

  const actions = useAppointmentActions({
    setEditingAppointment,
    setUpdateAndAcceptAppointment,
    setDecliningAppointment,
    onAccept: handleAccept,
    onComplete: handleComplete,
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<Appointment>[]) => {
    if (rows.length !== 1) return;
    setDeletingAppointment(rows[0].original);
  }, []);

  const deleteAppointment = useCallback(async () => {
    if (!deletingAppointment) return;
    const { error } = await supabase
      .from("appointment")
      .delete()
      .eq("id", deletingAppointment.id);
    if (error) throw new Error("Failed to delete appointment.");
    queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    queryClient.invalidateQueries({
      queryKey: appointmentKeys.count({ status: "pending" }),
    });
  }, [deletingAppointment]);

  // ── Open ──────────────────────────────────────────────────────────────────
  const handleOpen = useCallback((rows: Row<Appointment>[]) => {
    const first = rows[0];
    if (first) setEditingAppointment(first.original);
  }, []);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createAppointmentColumns(handleOpen, handleDeleteOpen, actions),
    [handleOpen, handleDeleteOpen, actions],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => appointments.filter((row) => rowSelection[row.id]),
    [appointments, rowSelection],
  );

  const handleFiltersChange = useCallback((newFilters: FilterRule[]) => {
    setFilters(newFilters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading appointments</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Breadcrumb items={breadcrumbItems} />

      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        actions={actions.map((a) => ({
          label: a.label,
          isEligible: (row: Appointment) =>
            a.isEligible?.({ original: row } as Row<Appointment>) ?? true,
          onSelect: (rows: Appointment[]) =>
            a.onSelect(rows.map((r) => ({ original: r }) as Row<Appointment>)),
        }))}
        onDelete={(rows) =>
          handleDeleteOpen(
            rows.map((r) => ({ original: r }) as Row<Appointment>),
          )
        }
        isDeleteEligible={() =>
          selectedRows.length === 1 &&
          ["completed", "cancelled", "declined"].includes(
            selectedRows[0].status,
          )
        }
        setRowSelection={setRowSelection}
      />

      <DataTable
        tableId={APPOINTMENTS_OVERVIEW_KEY}
        defaultViewName="Appointments"
        isLoading={isLoading}
        data={appointments}
        columns={columns}
        totalCount={total}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        initialColumnVisibility={appointmentColumnVisibility}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
        preFilters={preFilters}
      />

      {/* ── Dialogs ── */}
      <AppointmentAddDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingAppointment && (
        <AppointmentUpdateDialog
          open={!!editingAppointment}
          setOpen={(o) => !o && setEditingAppointment(null)}
          appointment={editingAppointment}
        />
      )}

      {updateAndAcceptAppointment && (
        <UpdateAndAcceptDialog
          open={!!updateAndAcceptAppointment}
          setOpen={(o) => !o && setUpdateAndAcceptAppointment(null)}
          appointment={updateAndAcceptAppointment}
        />
      )}

      {decliningAppointment && (
        <DeclineAppointmentDialog
          open={!!decliningAppointment}
          setOpen={(o) => !o && setDecliningAppointment(null)}
          appointment={decliningAppointment}
        />
      )}

      {deletingAppointment && (
        <DeleteDialog
          open={!!deletingAppointment}
          setOpen={(o) => !o && setDeletingAppointment(null)}
          id={deletingAppointment.id}
          title="Delete appointment"
          target="appointment"
          queryKeys={[
            appointmentKeys.all,
            appointmentKeys.count({ status: deletingAppointment.status }),
          ]}
          confirmationMessage={
            <>
              You're about to delete the appointment for{" "}
              <span className="font-semibold">{deletingAppointment.name}</span>.
              <br />
              Once deleted, the data cannot be recovered.
            </>
          }
          deleteFn={deleteAppointment}
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default AppointmentOverview;
