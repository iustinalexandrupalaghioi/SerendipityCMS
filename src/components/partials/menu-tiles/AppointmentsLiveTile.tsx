import type { ComponentType } from "react";
import LiveTile, { type BaseTileProps } from "./LiveTile";
import {
  type AppointmentFilters,
  useAppointmentsCount,
} from "@/components/business/appointments/overview/useAppointments";

export const createAppointmentsLiveTile =
  (filters: AppointmentFilters): ComponentType<BaseTileProps> =>
  ({ name, path, title, icon }: BaseTileProps) => {
    const { data: count } = useAppointmentsCount(filters);

    return (
      <LiveTile
        name={name}
        path={path}
        title={title}
        icon={icon}
        liveNumber={count ?? 0}
      />
    );
  };
