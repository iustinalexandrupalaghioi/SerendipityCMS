import {
  ChevronDownIcon,
  ChevronLeftIcon,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolbarActions from "./ToolbarActions";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export interface TableAction<TData> {
  label: React.ReactNode;
  isEligible?: (row: TData) => boolean;
  onSelect: (rows: TData[]) => void;
  destructive?: boolean;
}

interface ToolbarProps<TData> {
  selectedRows: TData[];
  slotId?: string;
  selectedCount: number;
  actions?: TableAction<TData>[];
  onDelete?: (rows: TData[]) => void;
  isDeleteEligible?: (row: TData) => boolean;
  addPath?: string;
  onAdd?: () => void;
  setRowSelection: (selection: Record<string, boolean>) => void;
}

export function Toolbar<TData>({
  selectedRows,
  selectedCount,
  actions,
  onDelete,
  isDeleteEligible,
  addPath,
  onAdd,
  setRowSelection,
  slotId,
}: ToolbarProps<TData>) {
  const navigate = useNavigate();

  if (
    !actions?.length &&
    !onDelete &&
    !addPath &&
    !onAdd &&
    slotId !== undefined
  )
    return null;

  // Actions and delete are only supported for single selection
  const isMulti = selectedCount > 1;

  const eligibleForDelete = isDeleteEligible
    ? selectedRows.filter(isDeleteEligible)
    : selectedRows;

  return (
    <ToolbarActions slotId={slotId}>
      <div className="flex items-center gap-2">
        {!slotId && (
          <Link to="/">
            <Button title="Back" type="button" size="icon" variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>
        )}
        {/* ── Add ── */}
        {(addPath || onAdd) && (
          <Button
            title="Add new"
            size="lg"
            variant="ghost"
            onClick={() => {
              if (onAdd) onAdd();
              else if (addPath) navigate(addPath);
            }}
          >
            <Plus />
          </Button>
        )}

        {/* ── Actions dropdown — disabled for multi-selection ── */}
        {!!actions?.length && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                variant="ghost"
                disabled={selectedCount === 0 || isMulti}
                title={
                  isMulti
                    ? "Actions are not available for multiple rows"
                    : undefined
                }
              >
                <Settings /> <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="w-fit"
              align="start"
            >
              {actions.map((action, i) => {
                const eligible = selectedRows.filter(
                  (r) => action.isEligible?.(r) ?? true,
                );
                return (
                  <DropdownMenuItem
                    key={i}
                    disabled={eligible.length === 0}
                    onSelect={() => action.onSelect(eligible)}
                  >
                    {action.label}
                    {/* {selectedCount > 0 && (
                      <span className="ml-1 text-muted-foreground">
                        ({eligible.length}/{selectedCount})
                      </span>
                    )} */}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ── Delete — disabled for multi-selection ── */}
        {onDelete && (
          <Button
            variant="ghost"
            size="lg"
            disabled={eligibleForDelete.length === 0 || isMulti}
            title={
              isMulti
                ? "Delete is not available for multiple rows"
                : `Delete ${eligibleForDelete.length} selected item(s)`
            }
            onClick={() => {
              if (isMulti) return;
              onDelete?.(eligibleForDelete);
              setRowSelection({});
            }}
          >
            <Trash2 />
            {/* {selectedCount > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                {eligibleForDelete.length}/{selectedCount}
              </span>
            )} */}
          </Button>
        )}
      </div>
    </ToolbarActions>
  );
}
