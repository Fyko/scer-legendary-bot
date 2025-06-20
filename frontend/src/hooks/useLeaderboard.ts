import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { API_CONFIG, CACHE_CONFIG, log } from '../constants/config';
import type { LeaderboardEntry, GroupedLeaderboard } from '../types';

/**
 * Fetch leaderboard data from API
 */
const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  log('Fetching leaderboard data');
  return apiClient.getLeaderboard();
};

/**
 * Group leaderboard entries by total count
 */
function groupLeaderboardByTotal(leaderboard: LeaderboardEntry[]): GroupedLeaderboard {
  return leaderboard.reduce((acc: GroupedLeaderboard, user: LeaderboardEntry) => {
    if (!acc[user.total]) {
      acc[user.total] = [];
    }
    acc[user.total].push(user);
    return acc;
  }, {} as GroupedLeaderboard);
}

/**
 * Custom hook for leaderboard data management
 * Provides grouped leaderboard data and sorted totals
 */
export function useLeaderboard() {
  const {
    data: leaderboard = [],
    isLoading,
    error,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: API_CONFIG.REFRESH_INTERVAL,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    refetchOnWindowFocus: CACHE_CONFIG.BACKGROUND_REFETCH,
  });

  // Group leaderboard by total count
  const groupedLeaderboard = useMemo(() => {
    log('Grouping leaderboard data, entries:', leaderboard.length);
    return groupLeaderboardByTotal(leaderboard);
  }, [leaderboard]);

  // Sort totals in descending order
  const sortedTotals = useMemo(() => {
    const totals = Object.keys(groupedLeaderboard)
      .map(Number)
      .sort((a, b) => b - a);
    log('Sorted totals:', totals);
    return totals;
  }, [groupedLeaderboard]);

  // Get top 3 for podium display
  const topThree = useMemo(() => {
    return sortedTotals.slice(0, 3);
  }, [sortedTotals]);

  // Get remaining entries for "Rising Legends" section
  const risingLegends = useMemo(() => {
    return sortedTotals.slice(3);
  }, [sortedTotals]);

  // Get total number of unique users
  const totalUsers = useMemo(() => {
    return leaderboard.length;
  }, [leaderboard]);

  // Get total number of legendary drops across all users
  const totalDrops = useMemo(() => {
    return leaderboard.reduce((total, user) => total + user.total, 0);
  }, [leaderboard]);

  return {
    // Raw data
    leaderboard,
    groupedLeaderboard,
    
    // Processed data
    sortedTotals,
    topThree,
    risingLegends,
    
    // Statistics
    totalUsers,
    totalDrops,
    
    // Query state
    isLoading,
    error,
    isRefetching,
    dataUpdatedAt,
    
    // Actions
    refetch,
  };
} 
