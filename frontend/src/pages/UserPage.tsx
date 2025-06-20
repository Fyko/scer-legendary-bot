import { useParams } from 'react-router-dom';
import { Navigation } from '../components/layout/Navigation';
import { UserHeader } from '../components/ui/UserHeader';
import { UserEventsList } from '../components/features/UserEventsList';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useUserLeggies } from '../hooks/useUserLeggies';
import { useTheme } from '../hooks/useTheme';

/**
 * User profile page component
 * Now uses extracted components and custom hooks for clean separation
 */
export default function UserPage() {
	const { user_id } = useParams<{ user_id: string }>();
	const { theme, toggleTheme } = useTheme();
	const { userInfo, eventCount, isLoading, error } = useUserLeggies(user_id);

	if (error) {
		return (
			<div className="min-h-screen bg-slate-900 text-white">
				<Navigation theme={theme} onThemeToggle={toggleTheme} />
				<main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
					<Card variant="default" padding="lg" className="text-center">
						<div className="text-xl mb-2">😕</div>
						<div className="text-white mb-4">Failed to load user profile</div>
						<div className="text-slate-400 text-sm mb-6">
							user might not exist or there was a network issue
						</div>
						<Button variant="primary" onClick={() => window.location.href = '/'}>
							← back to leaderboard
						</Button>
					</Card>
				</main>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-slate-900 text-white">
				<Navigation theme={theme} onThemeToggle={toggleTheme} />
				<main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
					<div className="flex justify-center">
						<LoadingSpinner size="lg" text="Loading user profile..." />
					</div>
				</main>
			</div>
		);
	}

	if (!userInfo) {
		return (
			<div className="min-h-screen bg-slate-900 text-white">
				<Navigation theme={theme} onThemeToggle={toggleTheme} />
				<main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
					<Card variant="default" padding="lg" className="text-center">
						<div className="text-xl mb-2">🤔</div>
						<div className="text-white mb-4">User not found</div>
						<div className="text-slate-400 text-sm mb-6">
							this user might not have any legendary drops yet
						</div>
						<Button variant="primary" onClick={() => window.location.href = '/'}>
							← back to leaderboard
						</Button>
					</Card>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-900 text-white">
			{/* Navigation */}
			<Navigation theme={theme} onThemeToggle={toggleTheme} />

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
				{/* User Header */}
				<UserHeader
					user={userInfo}
					totalLeggies={eventCount}
					// TODO: Add rank calculation when we have leaderboard context
				/>

				{/* User Events Timeline */}
				<UserEventsList userId={user_id!} />
			</main>
		</div>
	);
} 
