import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import React, { useEffect, useRef } from "react";
import { DataTableBody } from "./core/DataTableBody";
import { DataTableHeader } from "./core/DataTableHeader";
import { useDataTableContext } from "./DataTableContext";

// ─────────────────────────────────────────────
// DataTableContent
//
// Owns the scroll container, column sizing shell,
// colgroup, the <Table> element, and the infinite
// scroll sentinel. Reads everything from context.
// ─────────────────────────────────────────────

export function DataTableContent() {
  const {
    columnSizeVars,
    leafColumns,
    lastLeafColumnId,
    scrollContainerRef,
    handleScroll,
    height,
    quickSearchEnabled,
    globalFilter,
    setGlobalFilter,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDataTableContext();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ── Infinite scroll ──
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    const root = scrollContainerRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { root, rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const fixedColumnsWidth = leafColumns
    .slice(0, -1)
    .reduce((sum, col) => sum + col.getSize(), 0);

  return (
    <>
      {quickSearchEnabled && (
        <Input
          placeholder="Quick search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="mb-2 w-full"
        />
      )}

      <div style={columnSizeVars as React.CSSProperties}>
        <div style={{ position: "relative" }}>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-x-auto overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary"
            style={{ height: height || undefined, scrollbarGutter: "stable" }}
          >
            <Table
              style={{ minWidth: fixedColumnsWidth }}
              className="w-full table-fixed border-separate border-spacing-0"
            >
              <colgroup>
                {leafColumns.map((col) => (
                  <col
                    key={col.id}
                    style={{
                      width:
                        col.id === lastLeafColumnId
                          ? undefined
                          : `calc(var(--col-${col.id}-size) * 1px)`,
                      minWidth: `calc(var(--col-${col.id}-size) * 1px)`,
                    }}
                  />
                ))}
              </colgroup>
              <DataTableHeader />
              <DataTableBody />
            </Table>
            <div
              ref={loadMoreRef}
              className="flex h-10 items-center justify-center"
            />
          </div>
        </div>
      </div>
    </>
  );
}
