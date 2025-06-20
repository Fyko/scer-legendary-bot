import { Navigation } from '../components/layout/Navigation';
import { LatestEvents } from '../components/features/LatestEvents';
import { Leaderboard } from '../components/features/Leaderboard';
import { useTheme } from '../hooks/useTheme';
import type { LeaderboardPageProps } from '../types';

/**
 * Main leaderboard page component
 * Now uses extracted components and custom hooks for clean separation
 */
export default function LeaderboardPage({ theme, setTheme }: LeaderboardPageProps) {
	return (
		<div className="min-h-screen bg-slate-900 text-white">
			{/* Navigation */}
			<Navigation 
				theme={theme} 
				onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
			/>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
					{/* Latest Events - Left Column */}
					<aside className="lg:col-span-4 order-2 lg:order-1">
						<LatestEvents />
					</aside>

					{/* Leaderboard - Right Column */}
					<section className="lg:col-span-8 order-1 lg:order-2">
						<Leaderboard />
					</section>
				</div>
			</main>
		</div>
	);
} 
