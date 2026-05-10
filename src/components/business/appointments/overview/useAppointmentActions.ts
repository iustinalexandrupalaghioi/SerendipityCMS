import type { RowAction } from "@/components/data-table/core/types";
import type { Appointment } from "@/types/Appointment";
import type { Row } from "@tanstack/react-table";
import { useMemo, type Dispatch, type SetStateAction } from "react";

interface UseAppointmentActionsProps {
  setEditingAppointment: Dispatch<SetStateAction<Appointment | null>>;
  setUpdateAndAcceptAppointment: Dispatch<SetStateAction<Appointment | null>>;
  setDecliningAppointment: Dispatch<SetStateAction<Appointment | null>>;
  onAccept: (id: string) => void;
  onComplete: (id: string) => void;
  onNoShow: (id: string) => void;
}

export function useAppointmentActions({
  setEditingAppointment,
  setUpdateAndAcceptAppointment,
  setDecliningAppointment,
  onAccept,
  onComplete,
  onNoShow,
}: UseAppointmentActionsProps): RowAction<Appointment>[] {
  return useMemo(
    () => [
      {
        label: "Accept",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "pending",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          onAccept(rows[0].original.id);
        },
      },
      {
        label: "Edit & Accept",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "pending",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          setUpdateAndAcceptAppointment(rows[0].original);
        },
      },
      {
        label: "Decline",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "pending",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          setDecliningAppointment(rows[0].original);
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
      {
        label: "Mark as no show",
        isEligible: (row: Row<Appointment>) =>
          row.original.status === "confirmed",
        onSelect: (rows: Row<Appointment>[]) => {
          if (rows.length !== 1) return;
          onNoShow(rows[0].original.id);
        },
      },
    ],
    [
      setEditingAppointment,
      setUpdateAndAcceptAppointment,
      setDecliningAppointment,
      onAccept,
      onComplete,
      onNoShow,
    ],
  );
}
