import { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, Zap, Star, Crown, Medal, Award } from 'lucide-react';
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
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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
	const groupedLeaderboard: GroupedLeaderboard = leaderboard.reduce((acc: GroupedLeaderboard, user: LeaderboardEntry) => {
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

	const getPodiumIcon = (index: number) => {
		switch (index) {
			case 0: return <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />;
			case 1: return <Medal className="w-8 h-8 text-slate-400 drop-shadow-lg" />;
			case 2: return <Award className="w-8 h-8 text-amber-600 drop-shadow-lg" />;
			default: return <Trophy className="w-8 h-8 text-purple-400 drop-shadow-lg" />;
		}
	};

	const getPodiumGradient = (index: number) => {
		switch (index) {
			case 0: return 'from-yellow-400 via-yellow-500 to-amber-600';
			case 1: return 'from-slate-300 via-slate-400 to-slate-500';
			case 2: return 'from-amber-500 via-amber-600 to-orange-600';
			default: return 'from-purple-500 via-purple-600 to-indigo-600';
		}
	};

	if (latestError || leaderboardError) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-rose-900">
				<div className="text-center bg-black/20 backdrop-blur-xl rounded-3xl p-12 border border-red-500/30">
					<div className="text-red-400 mb-6">
						<Zap className="w-16 h-16 mx-auto animate-pulse" />
					</div>
					<h2 className="text-4xl font-bold mb-4 text-white">something broke lol</h2>
					<p className="text-red-300 text-lg">{(latestError as Error)?.message || (leaderboardError as Error)?.message}</p>
				</div>
			</div>
		);
	}

	if (isLatestLoading || isLeaderboardLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
				<div className="text-center">
					<div className="relative mb-8">
						<Star className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse animate-spin" />
					</div>
					<p className="text-white text-xl font-medium">loading the good stuff...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
			{/* Animated background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
			</div>

			<nav className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
				<div className="container mx-auto px-6 py-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
								<Trophy className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
									LEGENDARY LEADERBOARD
								</h1>
								<p className="text-slate-400 text-sm">where legends are made ✨</p>
							</div>
						</div>
						<button
							onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
							className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
							aria-label="Toggle theme"
						>
							{theme === 'light' ? '🌙' : '☀️'}
						</button>
					</div>
				</div>
			</nav>

			<main className="relative z-10 container mx-auto px-6 py-12">
				{/* Latest Events Section */}
				<section className="mb-16">
					<div className="flex items-center gap-4 mb-8">
						<div className="h-12 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
						<div>
							<h2 className="text-3xl font-bold text-white">RECENT DROPS</h2>
							<p className="text-slate-400">fresh legendary moments</p>
						</div>
					</div>
					<div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
						<div className="max-h-96 overflow-y-auto custom-scrollbar">
							{latest.map((event: LatestEvent, index: number) => (
								<div 
									key={event.id} 
									className="flex items-center p-6 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 text-white font-bold text-lg group-hover:scale-105 transition-transform duration-300">
										#{event.index}
									</div>
									<div className="w-px h-16 bg-gradient-to-b from-purple-500/50 to-pink-500/50 mx-6"></div>
									<div className="relative">
										<img
											src={event.user.avatar_url}
											alt={`${event.user.username}'s avatar`}
											className="w-16 h-16 rounded-2xl border-2 border-purple-500/50 group-hover:border-purple-400 transition-all duration-300"
										/>
										<div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900"></div>
									</div>
									<div className="flex-grow mx-6">
										<div className="font-bold text-lg text-white mb-1">{event.user.username}</div>
										<div className="text-slate-400 text-sm font-mono">{event.id}</div>
									</div>
									<div className="text-right space-y-2">
										<div className="flex items-center gap-2 text-slate-300">
											<Calendar className="w-4 h-4" />
											<span className="text-sm">{formatDate(event.created_at)}</span>
										</div>
										<div className="flex items-center gap-2 text-slate-400">
											<Clock className="w-4 h-4" />
											<span className="text-sm">{getRelativeTime(event.created_at)}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Leaderboard Section */}
				<section>
					<div className="flex items-center gap-4 mb-12">
						<div className="h-12 w-1 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
						<div>
							<h2 className="text-3xl font-bold text-white">HALL OF FAME</h2>
							<p className="text-slate-400">the absolute units</p>
						</div>
					</div>

					<div className="grid gap-8">
						{/* Top 3 Podium */}
						{sortedTotals.slice(0, 3).map((total, index) => (
							<div 
								key={total} 
								className="relative group"
								style={{ animationDelay: `${index * 200}ms` }}
							>
								<div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10"
									style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
								></div>
								<div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden hover:border-white/30 transition-all duration-500">
									<div className={`h-2 bg-gradient-to-r ${getPodiumGradient(index)}`}></div>
									<div className="p-8">
										<div className="flex items-center gap-6 mb-8">
											{getPodiumIcon(index)}
											<div>
												<h3 className="text-3xl font-bold text-white mb-2">
													{index === 0 ? '👑 LEGENDARY CHAMPION' : index === 1 ? '🥈 SILVER SOVEREIGN' : '🥉 BRONZE LEGEND'}
												</h3>
												<div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
													{total} LEGENDARY DROPS
												</div>
											</div>
										</div>
										<div className="grid gap-4">
											{groupedLeaderboard[total].map((user: LeaderboardEntry) => (
												<div
													key={user.user_id}
													className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/user"
												>
													<div className="relative">
														<img
															src={user.avatar_url}
															alt={`${user.display_name}'s avatar`}
															className="w-16 h-16 rounded-2xl border-2 border-purple-500/50 group-hover/user:border-purple-400 transition-all duration-300"
														/>
														<div className="absolute -bottom-2 -right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
															{user.total}
														</div>
													</div>
													<div>
														<div className="font-bold text-xl text-white">{user.display_name}</div>
														<div className="text-slate-400">absolute legend</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))}

						{/* Rest of the Rankings */}
						{sortedTotals.length > 3 && (
							<div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
								<div className="p-8">
									<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
										<Star className="w-6 h-6 text-purple-400" />
										RISING LEGENDS
									</h3>
									<div className="grid gap-6">
										{sortedTotals.slice(3).map((total) => (
											<div key={total} className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
												<div className="font-bold text-lg text-purple-400 mb-4 flex items-center gap-2">
													<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
														{total}
													</div>
													{total} LEGENDARY DROPS
												</div>
												<div className="grid gap-3">
													{groupedLeaderboard[total].map((user: LeaderboardEntry) => (
														<div key={user.user_id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
															<img
																src={user.avatar_url}
																alt={`${user.display_name}'s avatar`}
																className="w-12 h-12 rounded-xl border border-purple-500/30"
															/>
															<span className="text-white font-medium">{user.display_name}</span>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</section>
			</main>

			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.1);
					border-radius: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: linear-gradient(to bottom, #a855f7, #ec4899);
					border-radius: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: linear-gradient(to bottom, #9333ea, #db2777);
				}
			`}</style>
		</div>
	);
}
