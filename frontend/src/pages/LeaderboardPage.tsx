import { Navigation } from '../components/layout/Navigation';
import { LatestEvents } from '../components/features/LatestEvents';
import { Leaderboard } from '../components/features/Leaderboard';
import type { LeaderboardPageProps } from '../types';

/**
 * Main leaderboard page component
 * Now uses extracted components and custom hooks for clean separation
 */
export default function LeaderboardPage({ theme, setTheme }: LeaderboardPageProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850 text-white relative overflow-hidden">
			{/* Animated background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
				<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-accent-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
			</div>

			{/* Navigation */}
			<Navigation 
				theme={theme} 
				onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
			/>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
					{/* Latest Events - Left Column */}
					<aside className="lg:col-span-4 order-2 lg:order-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
						<LatestEvents />
					</aside>

					{/* Leaderboard - Right Column */}
					<section className="lg:col-span-8 order-1 lg:order-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
						<Leaderboard />
					</section>
				</div>
			</main>
		</div>
	);
} 
