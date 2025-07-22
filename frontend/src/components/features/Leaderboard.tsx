import { memo } from 'react';
import { Link } from 'react-router-dom';
import { PodiumCard } from '../ui/PodiumCard';
import { LeaderboardCard } from '../ui/LeaderboardCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import type { LeaderboardEntry } from '../../types';

interface LeaderboardProps {
  className?: string;
}

/**
 * Calculate proper ranks for leaderboard entries
 * Users with the same total get the same rank
 */
function calculateRanks(leaderboard: LeaderboardEntry[]) {
  const rankedEntries: Array<{ entry: LeaderboardEntry; rank: number }> = [];
  let currentRank = 1;
  
  for (let i = 0; i < leaderboard.length; i++) {
    const entry = leaderboard[i];
    
    // If this is not the first entry and the total is different from previous,
    // update the rank to the current position + 1
    if (i > 0 && entry.total !== leaderboard[i - 1].total) {
      currentRank = i + 1;
    }
    
    rankedEntries.push({ entry, rank: currentRank });
  }
  
  return rankedEntries;
}

/**
 * Leaderboard/Hall of Fame section component
 */
export const Leaderboard = memo(function Leaderboard({
  className = ''
}: LeaderboardProps) {
  const { leaderboard, isLoading, error, totalUsers, totalDrops } = useLeaderboard();

  if (error) {
    return (
      <Card variant="glass" padding="lg" className={`text-center animate-fade-in ${className}`}>
        <div className="text-slate-400 space-y-4">
          <div className="text-4xl mb-4">😕</div>
          <div className="text-lg font-medium text-white">failed to load leaderboard</div>
          <div className="text-sm">please try refreshing the page</div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className={`animate-fade-in ${className}`}>
        <LoadingSpinner size="lg" text="loading hall of fame..." />
      </div>
    );
  }

  if (!leaderboard?.length) {
    return (
      <Card variant="glass" padding="lg" className={`text-center animate-fade-in ${className}`}>
        <div className="text-slate-400 space-y-4">
          <div className="text-4xl mb-4">🏆</div>
          <div className="text-lg font-medium text-white">no legendary hunters yet</div>
          <div className="text-sm">be the first to pull a legendary!</div>
        </div>
      </Card>
    );
  }

  // Calculate proper ranks
  const rankedEntries = calculateRanks(leaderboard);
  const topThree = rankedEntries.slice(0, 3);
  const restOfLeaderboard = rankedEntries.slice(3);

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Header with enhanced stats */}
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gradient-purple mb-6 tracking-tight">
          🏆 hall of fame
        </h1>
        <div className="glass-effect rounded-2xl p-4 sm:p-6 border border-glass-200 shadow-glass max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-purple mb-1">
                {totalUsers}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                legendary hunters
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-pink mb-1">
                {totalDrops}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                drops found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium with staggered animations */}
      {topThree.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center animate-slide-up">
            👑 legendary elite
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {topThree.map(({ entry }, index) => (
              <Link
                key={entry.user_id}
                to={`/users/${entry.user_id}`}
                className="block group animate-scale-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <PodiumCard
                  entry={entry}
                  position={(index + 1) as 1 | 2 | 3}
                  className="group-hover:scale-[1.02] group-hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Rest of Leaderboard with improved spacing */}
      {restOfLeaderboard.length > 0 && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
            🎖️ legendary hunters
            <span className="text-slate-500 text-base font-normal">
              ({restOfLeaderboard.length} more)
            </span>
          </h2>
          
          <div className="space-y-3">
            {restOfLeaderboard.map(({ entry, rank }, index) => (
              <Link
                key={entry.user_id}
                to={`/users/${entry.user_id}`}
                className="block group animate-slide-up"
                style={{ animationDelay: `${0.6 + index * 0.05}s` }}
              >
                <LeaderboardCard
                  entry={entry}
                  rank={rank}
                  className="group-hover:scale-[1.01] group-hover:-translate-y-1 transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced footer actions */}
      <div className="text-center pt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="glass-effect rounded-2xl p-6 border border-glass-200 shadow-glass max-w-md mx-auto">
          <p className="text-slate-400 text-sm mb-4">
            updated in real-time as legends are discovered
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            className="font-medium hover:text-accent-purple transition-colors duration-300"
          >
            🔄 refresh leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}); 
