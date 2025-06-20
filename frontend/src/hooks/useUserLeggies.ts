import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { CACHE_CONFIG, log } from '../constants/config';
import type { LatestEvent, PaginationParams } from '../types';

/**
 * Fetch user's legendary events
 */
const fetchUserLeggies = async (
  userId: string, 
  params: PaginationParams = {}
): Promise<LatestEvent[]> => {
  log('Fetching user leggies for:', userId, 'with params:', params);
  return apiClient.getUserLeggies(userId, params);
};

/**
 * Custom hook for user's legendary events
 * Provides user events with proper loading and error states
 */
export function useUserLeggies(
  userId: string | undefined,
  params: PaginationParams = {}
) {
  const {
    data: userLeggies = [],
    isLoading,
    error,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['userLeggies', userId, params],
    queryFn: () => fetchUserLeggies(userId!, params),
    enabled: !!userId, // Only run if userId is provided
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    refetchOnWindowFocus: CACHE_CONFIG.BACKGROUND_REFETCH,
  });

  // Extract user info from first event (if available)
  const userInfo = userLeggies[0]?.user;

  // Check if user has any events
  const hasEvents = userLeggies.length > 0;

  // Get user stats
  const eventCount = userLeggies.length;

  log(
    'User leggies for', 
    userInfo?.username || userId, 
    ':', 
    eventCount, 
    'events'
  );

  return {
    // Data
    userLeggies,
    userInfo,
    eventCount,
    hasEvents,
    
    // Query state
    isLoading,
    error,
    isRefetching,
    dataUpdatedAt,
    
    // Actions
    refetch,
  };
} 
