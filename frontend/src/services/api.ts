import { API_CONFIG, log } from '../constants/config';
import type { LatestEvent, LeaderboardEntry, PaginationParams } from '../types';

// Custom error class for API errors
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public endpoint?: string,
		public timestamp = new Date().toISOString(),
	) {
		super(message);
		this.name = 'ApiError';
	}
}

// Network error class
export class NetworkError extends ApiError {
	constructor(message: string, endpoint?: string) {
		super(message, 0, endpoint);
		this.name = 'NetworkError';
	}
}

// Timeout error class
export class TimeoutError extends ApiError {
	constructor(endpoint?: string) {
		super('Request timeout', 408, endpoint);
		this.name = 'TimeoutError';
	}
}

class ApiClient {
	private baseUrl: string;
	private timeout: number;

	constructor(baseUrl: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
		this.baseUrl = baseUrl;
		this.timeout = timeout;
	}

	private async requestWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				...options,
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === 'AbortError') {
				throw new TimeoutError(url);
			}
			throw error;
		}
	}

	private async requestWithRetry<T>(endpoint: string, options?: RequestInit, retryCount = 0): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		try {
			log(`API Request: ${options?.method || 'GET'} ${url}`);

			const response = await this.requestWithTimeout(
				url,
				{
					headers: {
						'Content-Type': 'application/json',
						...options?.headers,
					},
					...options,
				},
				this.timeout,
			);

			if (!response.ok) {
				const errorText = await response.text().catch(() => 'Unknown error');
				throw new ApiError(
					`API request failed: ${response.status} ${response.statusText} - ${errorText}`,
					response.status,
					endpoint,
				);
			}

			const data = await response.json();
			log(`API Response: ${url}`, data);
			return data;
		} catch (error) {
			log(`API Error: ${url}`, error);

			// Retry logic for certain errors
			if (
				retryCount < API_CONFIG.RETRY.ATTEMPTS &&
				(error instanceof NetworkError ||
					error instanceof TimeoutError ||
					(error instanceof ApiError && error.status >= 500))
			) {
				const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_MULTIPLIER, retryCount);
				log(`Retrying request in ${delay}ms (attempt ${retryCount + 1}/${API_CONFIG.RETRY.ATTEMPTS})`);

				await new Promise((resolve) => setTimeout(resolve, delay));
				return this.requestWithRetry(endpoint, options, retryCount + 1);
			}

			// Transform network errors
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new NetworkError(`Network error: ${error.message}`, endpoint);
			}

			// Re-throw ApiError and TimeoutError as-is
			if (error instanceof ApiError || error instanceof TimeoutError) {
				throw error;
			}

			// Wrap unknown errors
			throw new NetworkError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`, endpoint);
		}
	}

	/**
	 * Fetch latest events with pagination
	 */
	async getLatestEvents(page: number = 1, limit: number = API_CONFIG.PAGINATION.DEFAULT_LIMIT): Promise<LatestEvent[]> {
		// Validate parameters
		if (page < 1) throw new Error('Page must be >= 1');
		if (limit < 1 || limit > API_CONFIG.PAGINATION.MAX_LIMIT) {
			throw new Error(`Limit must be between 1 and ${API_CONFIG.PAGINATION.MAX_LIMIT}`);
		}

		return this.requestWithRetry<LatestEvent[]>(`${API_CONFIG.ENDPOINTS.LATEST}?page=${page}&limit=${limit}`);
	}

	/**
	 * Fetch leaderboard data
	 */
	async getLeaderboard(): Promise<LeaderboardEntry[]> {
		return this.requestWithRetry<LeaderboardEntry[]>(API_CONFIG.ENDPOINTS.LEADERBOARD);
	}

	/**
	 * Fetch user's legendary events
	 */
	async getUserLeggies(userId: string, params: PaginationParams = {}): Promise<LatestEvent[]> {
		if (!userId) throw new Error('User ID is required');

		const { page = 1, limit = 100 } = params;

		// Validate parameters
		if (page < 1) throw new Error('Page must be >= 1');
		if (limit < 1 || limit > API_CONFIG.PAGINATION.MAX_LIMIT) {
			throw new Error(`Limit must be between 1 and ${API_CONFIG.PAGINATION.MAX_LIMIT}`);
		}

		return this.requestWithRetry<LatestEvent[]>(
			`${API_CONFIG.ENDPOINTS.USER_LEGGIES}/${encodeURIComponent(userId)}/leggies?page=${page}&limit=${limit}`,
		);
	}

	/**
	 * Health check endpoint
	 */
	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		return this.requestWithRetry<{ status: string; timestamp: string }>('/health');
	}
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export classes for testing and custom implementations
export { ApiClient };
