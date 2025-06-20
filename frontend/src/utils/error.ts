// Error handling utilities

// Define error types locally to avoid circular imports
interface ApiErrorType {
  name: string;
  message: string;
  status: number;
  endpoint?: string;
  timestamp?: string;
}

/**
 * Check if error is an API error
 */
function isApiError(error: unknown): error is ApiErrorType {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'status' in error &&
    typeof (error as any).status === 'number'
  );
}

/**
 * Check if error is a timeout error
 */
function isTimeoutError(error: unknown): boolean {
  return isApiError(error) && error.name === 'TimeoutError';
}

/**
 * Check if error is a network error
 */
function isNetworkError(error: unknown): boolean {
  return isApiError(error) && error.name === 'NetworkError';
}

/**
 * Get user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isTimeoutError(error)) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  if (isNetworkError(error)) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please try again.';
      case 401:
        return 'Authentication required.';
      case 403:
        return 'Access denied.';
      case 404:
        return 'Data not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (isTimeoutError(error) || isNetworkError(error)) {
    return true;
  }
  
  if (isApiError(error)) {
    // Retry server errors and rate limiting
    return error.status >= 500 || error.status === 429;
  }
  
  return false;
}

/**
 * Get error severity level for logging/UI purposes
 */
export function getErrorSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
  if (isTimeoutError(error) || isNetworkError(error)) {
    return 'medium';
  }
  
  if (isApiError(error)) {
    if (error.status >= 500) return 'high';
    if (error.status >= 400) return 'medium';
    return 'low';
  }
  
  return 'medium';
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: unknown): {
  message: string;
  status?: number;
  endpoint?: string;
  timestamp?: string;
  severity: string;
} {
  const severity = getErrorSeverity(error);
  
  if (isApiError(error)) {
    return {
      message: error.message,
      status: error.status,
      endpoint: error.endpoint,
      timestamp: error.timestamp,
      severity
    };
  }
  
  return {
    message: error instanceof Error ? error.message : String(error),
    severity
  };
} 
