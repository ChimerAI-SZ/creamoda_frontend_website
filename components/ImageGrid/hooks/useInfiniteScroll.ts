import { useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loadMore: () => void;
  rootMargin?: string;
}

export function useInfiniteScroll({ hasMore, loadMore, rootMargin = '0px' }: UseInfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting && hasMore) {
            loadMore();
          }
        },
        { rootMargin }
      );

      if (node) observerRef.current.observe(node);
    },
    [hasMore, loadMore, rootMargin]
  );

  return { containerRef, lastItemRef };
}
