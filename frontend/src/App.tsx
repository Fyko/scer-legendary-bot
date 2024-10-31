import { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

// Types
interface User {
	id: string;
	username: string;
	avatar_url: string;
}

interface LatestEvent {
	id: string;
	index: number;
	user: User;
	created_at: string;
}

interface LeaderboardEntry {
	user_id: string;
	total: number;
	display_name: string;
	avatar_url: string;
}

type GroupedLeaderboard = {
	[key: number]: LeaderboardEntry[];
};

// API Functions
const fetchLatest = async (): Promise<LatestEvent[]> => {
	const response = await fetch('http://localhost:3223/api/v1/latest');
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
};

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
	const response = await fetch('http://localhost:3223/api/v1/leaderboard');
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
};

export default function App() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	const {
		data: latest = [],
		isLoading: isLatestLoading,
		error: latestError,
	} = useQuery({
		queryKey: ['latest'],
		queryFn: fetchLatest,
		refetchInterval: 1000 * 60 * 5, // 5 minutes
	});

	const {
		data: leaderboard = [],
		isLoading: isLeaderboardLoading,
		error: leaderboardError,
	} = useQuery({
		queryKey: ['leaderboard'],
		queryFn: fetchLeaderboard,
		refetchInterval: 1000 * 60 * 5, // 5 minutes
	});

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme]);

	const formatDate = (dateString: string): string => new Date(dateString).toLocaleString();

	const getRelativeTime = (dateString: string): string => {
		const date = new Date(dateString);
		return formatDistanceToNow(date, { addSuffix: true });
	};

	// Group leaderboard by total count
	const groupedLeaderboard: GroupedLeaderboard = leaderboard.reduce((acc, user) => {
		if (!acc[user.total]) {
			acc[user.total] = [];
		}
		acc[user.total].push(user);
		return acc;
	}, {} as GroupedLeaderboard);

	// Sort by total count in descending order
	const sortedTotals = Object.keys(groupedLeaderboard)
		.map(Number)
		.sort((a, b) => b - a);

	if (latestError || leaderboardError) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-red-500 text-center">
					<h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
					<p>{(latestError as Error)?.message || (leaderboardError as Error)?.message}</p>
				</div>
			</div>
		);
	}

	if (isLatestLoading || isLeaderboardLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
					<p className="text-gray-600 dark:text-gray-300">Loading data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			<nav className="bg-white dark:bg-gray-800 shadow-md p-4">
				<div className="container mx-auto flex justify-between items-center">
					<h1 className="text-2xl font-bold">Leggies Leaderboard</h1>
					<button
						onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
						className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
						aria-label="Toggle theme"
					>
						{theme === 'light' ? '🌙' : '☀️'}
					</button>
				</div>
			</nav>

			<main className="container mx-auto px-4 py-8">
				<section aria-label="Latest Events" className="mb-12">
					<h2 className="text-xl font-bold mb-4">Latest Events</h2>
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
						{latest.map((event) => (
							<div key={event.id} className="flex items-start p-4 border-b dark:border-gray-700">
              <div className="w-12 h-12 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                #{event.index}
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700 mx-4 self-stretch" />
              <img
                src={event.user.avatar_url}
                alt={`${event.user.username}'s avatar`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-grow mx-4">
                <div className="font-semibold">{event.user.username}</div>
                <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">{event.id}</div>
              </div>
              <div className="grid grid-cols-[1.5rem,1fr] gap-x-2 min-w-[300px]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(event.created_at)}</span>
                <Clock className="w-4 h-4" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{getRelativeTime(event.created_at)}</span>
              </div>
            </div>
						))}
					</div>
				</section>

				<section aria-label="Leaderboard" className="grid gap-8">
					{sortedTotals.slice(0, 3).map((total, index) => (
						<div key={total} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
							<div className="flex items-center gap-2 mb-4">
								<Trophy
									className={`w-8 h-8 ${
										index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-400'
									}`}
								/>
								<h3 className="text-2xl font-bold">
									{index === 0 ? '🥇 First Place' : index === 1 ? '🥈 Second Place' : '🥉 Third Place'}
								</h3>
							</div>
							<div className="grid gap-4">
								{groupedLeaderboard[total].map((user) => (
									<div
										key={user.user_id}
										className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
									>
										<img
											src={user.avatar_url}
											alt={`${user.display_name}'s avatar`}
											className="w-12 h-12 rounded-full"
										/>
										<div>
											<div className="font-semibold">{user.display_name}</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">{user.total} leggies</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}

					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<h3 className="text-xl font-bold mb-4">Other Rankings</h3>
						<div className="grid gap-4">
							{sortedTotals.slice(3).map((total) => (
								<div key={total} className="border-b dark:border-gray-700 pb-4">
									<div className="font-semibold mb-2">{total} Leggies</div>
									<div className="grid gap-2">
										{groupedLeaderboard[total].map((user) => (
											<div key={user.user_id} className="flex items-center gap-4">
												<img
													src={user.avatar_url}
													alt={`${user.display_name}'s avatar`}
													className="w-8 h-8 rounded-full"
												/>
												<span>{user.display_name}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
