// Shared type definitions for the application

export interface User {
  id: string;
  username: string;
  avatar_url: string;
}

export interface LatestEvent {
  id: string;
  index: number;
  url: string;
  user: User;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  total: number;
  display_name: string;
  avatar_url: string;
}

// Utility types
export type GroupedLeaderboard = {
  [key: number]: LeaderboardEntry[];
};

// API Error types
export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Query parameter types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface LatestEventsParams extends PaginationParams {
  userId?: string;
}

// Theme types
export type Theme = 'light' | 'dark';

// Component prop types
export interface LeaderboardPageProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Loading and error state types
export interface LoadingState {
  isLoading: boolean;
  isRefetching?: boolean;
  isFetchingNextPage?: boolean;
}

export interface ErrorState {
  error: Error | null;
  hasError: boolean;
}

// API endpoint types for better type safety
export interface ApiEndpoints {
  readonly LATEST: string;
  readonly LEADERBOARD: string;
  readonly USER_LEGGIES: string;
}

// Environment types
export interface AppConfig {
  readonly API_BASE_URL: string;
  readonly ENVIRONMENT: 'development' | 'production' | 'test';
  readonly DEBUG: boolean;
} 
