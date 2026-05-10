import type { RowAction } from "@/components/data-table/core/types";
import type { Enrollment } from "@/types/Course";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";

interface UseEnrollmentActionsProps {
  onComplete: (id: string) => void;
  onNoShow: (id: string) => void;
}

export function useEnrollmentActions({
  onComplete,
  onNoShow,
}: UseEnrollmentActionsProps): RowAction<Enrollment>[] {
  return useMemo(
    () => [
      {
        label: "Complete",
        isEligible: (row: Row<Enrollment>) =>
          row.original.status === "confirmed",
        onSelect: (rows: Row<Enrollment>[]) => {
          if (rows.length !== 1) return;
          onComplete(rows[0].original.id);
        },
      },
      {
        label: "Mark as no show",
        isEligible: (row: Row<Enrollment>) =>
          row.original.status === "confirmed",
        onSelect: (rows: Row<Enrollment>[]) => {
          if (rows.length !== 1) return;
          onNoShow(rows[0].original.id);
        },
      },
    ],
    [onComplete],
  );
}
