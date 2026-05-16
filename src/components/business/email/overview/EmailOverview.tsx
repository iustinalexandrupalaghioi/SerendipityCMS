import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { Toolbar } from "@/components/toolbar/Toolbar";
import type { Email } from "@/types/Email";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { createEmailColumns, emailColumnVisibility } from "./EmailColumns";
import { emailKeys, useEmails } from "./useEmails";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { useSearchParams } from "react-router";

export const EMAILS_OVERVIEW_KEY = "emails-overview";

const EmailOverview = () => {
  const [searchParams] = useSearchParams();
  const isError = searchParams.get("error") === "true";

  // ── Table state ──
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(EMAILS_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(EMAILS_OVERVIEW_KEY),
  );
  const [deletingEmail, setDeletingEmail] = useState<Email | null>(null);

  const preFilters = useMemo<FilterRule[]>(() => {
    if (!isError) return [];
    return [
      {
        columnId: "error",
        columnType: "boolean",
        columnName: "Error",
        operator: "is_true",
        value: null,
      },
    ];
  }, [isError]);

  // ── Data ──
  const {
    allItems: emails,
    total,
    isLoading,
    isError: fetchError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useEmails(sorting, [...preFilters, ...filters]);

  const breadcrumbItems = useMemo(() => {
    const items = [
      { path: "/", label: "Home" },
      { path: "/emails", label: "Emails" },
    ];
    if (isError) items.push({ path: "", label: "Errors" });
    return items;
  }, [isError]);

  // ── Delete ──
  const handleDeleteOpen = useCallback((rows: Row<Email>[]) => {
    if (rows.length !== 1) return;
    setDeletingEmail(rows[0].original);
  }, []);

  // ── Columns ──
  const columns = useMemo(
    () => createEmailColumns(handleDeleteOpen),
    [handleDeleteOpen],
  );

  // ── Selection ──
  const selectedRows = useMemo(
    () => emails.filter((row) => rowSelection[row.id]),
    [emails, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (fetchError) return <div>Error loading emails</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Breadcrumb items={breadcrumbItems} />

      <Toolbar
        selectedRows={selectedRows}
        onDelete={(rows) =>
          handleDeleteOpen(rows.map((r) => ({ original: r }) as Row<Email>))
        }
        selectedCount={Object.keys(rowSelection).length}
        setRowSelection={setRowSelection}
      />

      <DataTable
        tableId={EMAILS_OVERVIEW_KEY}
        defaultViewName={isError ? "Email errors" : "Emails"}
        isLoading={isLoading}
        data={emails}
        columns={columns}
        totalCount={total}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        initialColumnVisibility={emailColumnVisibility}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
        preFilters={preFilters}
      />

      {deletingEmail && (
        <DeleteDialog
          open={!!deletingEmail}
          setOpen={(o) => !o && setDeletingEmail(null)}
          id={deletingEmail.id}
          title="Delete email"
          target="email"
          queryKeys={[emailKeys.all]}
          confirmationMessage={
            <>
              You're about to delete the email sent to{" "}
              <span className="font-semibold">"{deletingEmail.to}"</span>.
              <br />
              Once deleted, the data cannot be recovered.
            </>
          }
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default EmailOverview;
