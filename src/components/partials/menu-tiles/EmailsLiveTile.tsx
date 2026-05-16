import type { ComponentType } from "react";
import LiveTile, { type BaseTileProps } from "./LiveTile";
import {
  useEmailsCount,
  type EmailFilters,
} from "@/components/business/email/overview/useEmails";

export const createEmailsLiveTile =
  (filters: EmailFilters): ComponentType<BaseTileProps> =>
  ({ name, path, title, icon }: BaseTileProps) => {
    const { data: count } = useEmailsCount(filters);

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
