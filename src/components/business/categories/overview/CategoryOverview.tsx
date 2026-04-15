import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import { Toolbar } from "@/components/toolbar/Toolbar";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import type { Category } from "@/types/Category";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import {
  categoryColumnVisibility,
  createCategoryColumns,
} from "./CategoryColumns";
import { useCategories, QUERY_KEY } from "./useCategories";
import { AddCategoryDialog } from "../form/AddCategoryDialog";
import { UpdateCategoryDialog } from "../form/UpdateCategoryDialog";

export const CATEGORIES_OVERVIEW_KEY = "categories-overview";

const CategoryOverview = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(CATEGORIES_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(CATEGORIES_OVERVIEW_KEY),
  );

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useCategories(sorting, filters);
  const categories = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Open (edit) ───────────────────────────────────────────────────────────
  const handleOpen = useCallback((rows: Row<Category>[]) => {
    const first = rows[0];
    if (first) setEditingCategory(first.original);
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<Category>[]) => {
    if (rows.length !== 1) return;
    setDeletingCategory(rows[0].original);
  }, []);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCategoryColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => categories.filter((row) => rowSelection[row.id]),
    [categories, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDeleteOpen(rows.map((r) => ({ original: r }) as Row<Category>))
        }
        setRowSelection={setRowSelection}
      />

      <DataTable
        isLoading={isLoading}
        defaultViewName="Categories"
        tableId={CATEGORIES_OVERVIEW_KEY}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        columns={columns}
        initialColumnVisibility={categoryColumnVisibility}
        data={categories}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
      />

      {/* ── Dialogs ── */}
      <AddCategoryDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingCategory && (
        <UpdateCategoryDialog
          open={!!editingCategory}
          setOpen={(open) => !open && setEditingCategory(null)}
          category={editingCategory}
        />
      )}

      {deletingCategory && (
        <DeleteDialog
          open={!!deletingCategory}
          setOpen={(open) => !open && setDeletingCategory(null)}
          id={deletingCategory.id}
          title="Delete Category"
          target="category"
          queryKeys={[QUERY_KEY]}
          confirmationMessage={
            <>
              You're about to delete{" "}
              <span className="font-semibold">"{deletingCategory.name}"</span>.
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

export default CategoryOverview;
