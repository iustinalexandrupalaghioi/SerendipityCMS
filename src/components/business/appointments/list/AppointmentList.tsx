import DataTable from "@/components/partials/data-table/DataTable";
import LoaderScreen from "@/components/ui/loader";
import { useAppointments } from "@/hooks/useAppointments";
import { Navigate, useParams } from "react-router-dom";
import { AppoitmentsColumns } from "./AppointmentColumn";
import { toast } from "sonner";
import { isAppointmentStatus } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/Appointment";
import { AppointmentAddDialog } from "../form/AppointmentAddDialog";

const statusEnum = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
] as const;

const AppointmentList = () => {
  const { status } = useParams();
  if (status && !isAppointmentStatus(status)) {
    toast.error("Invalid appointment status");
    return <Navigate to="/" />;
  }
  const { data, isLoading, error } = useAppointments({
    status: status as AppointmentStatus,
    today: status === "confirmed",
  });

  return (
    <div className="w-full py-2">
      <AppointmentAddDialog />
      {isLoading && <LoaderScreen />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterTextColumns={["Customer name"]}
          filterTextPlaceholders={["Search by customer name..."]}
          filterTextLabels={["Customer name"]}
          filterEnumColumns={["Status"]}
          filterEnumPlaceholders={["All"]}
          filterEnumLabels={["Status"]}
          enums={[statusEnum]}
          columns={AppoitmentsColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default AppointmentList;
