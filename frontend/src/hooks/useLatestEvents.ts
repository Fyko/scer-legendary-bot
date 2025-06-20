import { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { API_CONFIG, CACHE_CONFIG, log } from '../constants/config';
import type { LatestEvent } from '../types';

/**
 * Fetch latest events with pagination
 */
const fetchLatest = async ({ pageParam = 1 }): Promise<LatestEvent[]> => {
  log('Fetching latest events, page:', pageParam);
  return apiClient.getLatestEvents(pageParam, API_CONFIG.PAGINATION.DEFAULT_LIMIT);
};

/**
 * Custom hook for infinite scroll functionality
 * Handles scroll detection and automatic page loading
 */
export function useInfiniteScroll(
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void,
  threshold = API_CONFIG.PAGINATION.SCROLL_THRESHOLD
) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll events for infinite scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // Trigger when we're within threshold of the bottom
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      log('Triggering next page fetch');
      fetchNextPage();
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return { scrollContainerRef };
}

/**
 * Custom hook for latest events with infinite scroll
 * Provides flattened events list and scroll functionality
 */
export function useLatestEvents() {
  const {
    data: latestData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useInfiniteQuery({
    queryKey: ['latest'],
    queryFn: fetchLatest,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer than default limit items, we've reached the end
      return lastPage.length === API_CONFIG.PAGINATION.DEFAULT_LIMIT 
        ? allPages.length + 1 
        : undefined;
    },
    refetchInterval: API_CONFIG.REFRESH_INTERVAL,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    refetchOnWindowFocus: CACHE_CONFIG.BACKGROUND_REFETCH,
  });

  // Flatten all pages into a single array
  const events = latestData?.pages.flat() || [];

  // Infinite scroll functionality
  const { scrollContainerRef } = useInfiniteScroll(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  // Get loading status message
  const getStatusMessage = () => {
    if (isFetchingNextPage) {
      return 'loading more legendary drops...';
    }
    if (hasNextPage) {
      return 'scroll for more';
    }
    return "that's all the legendary drops rn ✨";
  };

  // Get total pages loaded
  const pagesLoaded = latestData?.pages.length || 0;

  log('Latest events loaded:', events.length, 'events across', pagesLoaded, 'pages');

  return {
    // Data
    events,
    pagesLoaded,
    
    // Query state
    isLoading,
    error,
    isRefetching,
    dataUpdatedAt,
    
    // Pagination state
    hasNextPage,
    isFetchingNextPage,
    
    // UI helpers
    scrollContainerRef,
    statusMessage: getStatusMessage(),
    
    // Actions
    fetchNextPage,
    refetch,
  };
} 
