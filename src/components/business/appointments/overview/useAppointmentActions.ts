import type { RowAction } from "@/components/data-table/core/types";
import type { Appointment } from "@/types/Appointment";
import type { Row } from "@tanstack/react-table";
import { useMemo, type Dispatch, type SetStateAction } from "react";

interface UseAppointmentActionsProps {
  setEditingAppointment: Dispatch<SetStateAction<Appointment | null>>;
  setUpdateAndApproveAppointment: Dispatch<SetStateAction<Appointment | null>>;
  setRejectingAppointment: Dispatch<SetStateAction<Appointment | null>>;
  onApprove: (id: string) => void;
  onComplete: (id: string) => void;
}

export function useAppointmentActions({
  setEditingAppointment,
  setUpdateAndApproveAppointment,
  setRejectingAppointment,
  onApprove,
  onComplete,
}: UseAppointmentActionsProps): RowAction<Appointment>[] {
  return useMemo(
    () => [
      {
        label: "Approve",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "pending",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          onApprove(rows[0].original.id);
        },
      },
      {
        label: "Update & Approve",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "pending",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          setUpdateAndApproveAppointment(rows[0].original);
        },
      },
      {
        label: "Reject",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "pending",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          setRejectingAppointment(rows[0].original);
        },
      },
      {
        label: "Complete",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "confirmed",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          onComplete(rows[0].original.id);
        },
      },
    ],
    [
      setEditingAppointment,
      setUpdateAndApproveAppointment,
      setRejectingAppointment,
      onApprove,
      onComplete,
    ],
  );
}
