import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date string to a localized string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Get short relative time string (e.g., "2h", "3d")
 */
export const getShortRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`;
  return `${Math.floor(diffInSeconds / 31536000)}y`;
}; 
