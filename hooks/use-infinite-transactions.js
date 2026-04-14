// hooks/use-infinite-transactions.js
import { useState, useEffect, useRef, useCallback } from "react";
import { getUserTransactions } from "@/actions/transaction";

export function useInfiniteTransactions(filters = {}) {
  const [pages, setPages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async (cursor = null) => {
    if (isLoading || (!hasNextPage && cursor !== null)) return;
    setIsLoading(true);
    try {
      const result = await getUserTransactions({ ...filters, cursor });
      setPages(prev => cursor ? [...prev, result.items] : [result.items]);
      setNextCursor(result.nextCursor);
      setHasNextPage(result.hasNextPage);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isLoading, hasNextPage]);

  // Reset when filters change
  useEffect(() => {
    setPages([]);
    setNextCursor(null);
    setHasNextPage(true);
    loadMore(null);
  }, [JSON.stringify(filters)]);

  // Intersection Observer for sentinel element
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(nextCursor); },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadMore]);

  return {
    transactions: pages.flat(),
    isLoading,
    hasNextPage,
    sentinelRef,
  };
}