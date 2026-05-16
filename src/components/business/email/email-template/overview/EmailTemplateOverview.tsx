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
import { EMAIL_TYPES_OPTIONS, type EmailTemplate } from "@/types/Email";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import {
  createEmailTemplateColumns,
  emailTemplateColumnVisibility,
} from "./EmailTemplateColumns";
import { emailTemplateKeys, useEmailTemplates } from "./useEmailTemplates";
import { AddEmailTemplateDialog } from "../form/AddEmailTemplateDialog";
import { UpdateEmailTemplateDialog } from "../form/UpdateEmailTemplateDialog";

export const EMAIL_TEMPLATES_OVERVIEW_KEY = "email-templates-overview";

const EmailTemplateOverview = () => {
  // ── Table state ──
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(EMAIL_TEMPLATES_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(EMAIL_TEMPLATES_OVERVIEW_KEY),
  );

  // ── Dialog state ──
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null,
  );
  const [deletingTemplate, setDeletingTemplate] =
    useState<EmailTemplate | null>(null);

  // ── Data ──
  const {
    allItems: templates,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useEmailTemplates(sorting, filters);

  // ── Open (edit) ──
  const handleOpen = useCallback((rows: Row<EmailTemplate>[]) => {
    const first = rows[0];
    if (first) setEditingTemplate(first.original);
  }, []);

  // ── Delete ──
  const handleDeleteOpen = useCallback((rows: Row<EmailTemplate>[]) => {
    if (rows.length !== 1) return;
    setDeletingTemplate(rows[0].original);
  }, []);

  // ── Columns ──
  const columns = useMemo(
    () => createEmailTemplateColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ──
  const selectedRows = useMemo(
    () => templates.filter((row) => rowSelection[row.id]),
    [templates, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading email templates</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Breadcrumb
        items={[
          { path: "/", label: "Home" },
          { path: "/email-templates", label: "Email templates" },
        ]}
      />

      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDeleteOpen(
            rows.map((r) => ({ original: r }) as Row<EmailTemplate>),
          )
        }
        setRowSelection={setRowSelection}
      />

      <DataTable
        tableId={EMAIL_TEMPLATES_OVERVIEW_KEY}
        defaultViewName="Email templates"
        isLoading={isLoading}
        data={templates}
        columns={columns}
        totalCount={total}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        initialColumnVisibility={emailTemplateColumnVisibility}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
      />

      {/* ── Dialogs ── */}
      <AddEmailTemplateDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingTemplate && (
        <UpdateEmailTemplateDialog
          open={!!editingTemplate}
          setOpen={(o) => !o && setEditingTemplate(null)}
          emailTemplate={editingTemplate}
        />
      )}

      {deletingTemplate && (
        <DeleteDialog
          open={!!deletingTemplate}
          setOpen={(o) => !o && setDeletingTemplate(null)}
          id={deletingTemplate.id}
          title="Delete email template"
          target="email_template"
          queryKeys={[emailTemplateKeys.all]}
          confirmationMessage={
            <>
              You're about to delete the email template{" "}
              <span className="font-semibold">
                "
                {
                  EMAIL_TYPES_OPTIONS.find(
                    (o) => o.value === deletingTemplate.email_type,
                  )?.label
                }
                "
              </span>
              .
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

export default EmailTemplateOverview;
