import type { ApiEndpoints, AppConfig } from '../types';

// Environment configuration
export const ENV_CONFIG: AppConfig = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:22291',
  ENVIRONMENT: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
  DEBUG: import.meta.env.DEV || false,
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ENDPOINTS: {
    LATEST: '/api/v1/latest',
    LEADERBOARD: '/api/v1/leaderboard',
    USER_LEGGIES: '/api/v1/users'
  } as ApiEndpoints,
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    SCROLL_THRESHOLD: 100 // pixels from bottom to trigger load
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_MULTIPLIER: 2
  }
} as const;

export const THEME_CONFIG = {
  STORAGE_KEY: 'legendary-theme',
  DEFAULT_THEME: 'dark' as const,
  TRANSITION_DURATION: 300 // milliseconds
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  STALE_TIME: 30 * 1000, // 30 seconds
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  BACKGROUND_REFETCH: true
} as const;

// Feature flags (for future use)
export const FEATURE_FLAGS = {
  INFINITE_SCROLL: true,
  THEME_TOGGLE: true,
  USER_PROFILES: true,
  REAL_TIME_UPDATES: false
} as const;

// Debug logging helper
export const log = (...args: unknown[]) => {
  if (ENV_CONFIG.DEBUG) {
    console.log('[LEGENDARY]', ...args);
  }
}; 
