// hooks/useInfiniteTable.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface PageResult<TItem> {
  items: TItem[];
  total: number;
  pageIndex: number;
}

interface UseInfiniteQuery<TItem> {
  queryKey: readonly unknown[];
  fetchPage: (pageParam: number) => Promise<PageResult<TItem>>;
  pageSize: number;
}
export function useInfiniteTable<TItem>({
  queryKey,
  fetchPage,
  pageSize: _,
}: UseInfiniteQuery<TItem>) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      if (totalLoaded >= lastPage.total) return undefined;
      return lastPage.pageIndex + 1;
    },
    staleTime: 1000 * 60,
  });

  const allItems = useMemo(
    () => query.data?.pages.flatMap((p) => p.items) ?? [],
    [query.data],
  );

  return {
    ...query,
    allItems,
    total: query.data?.pages[0]?.total ?? 0,
  };
}
