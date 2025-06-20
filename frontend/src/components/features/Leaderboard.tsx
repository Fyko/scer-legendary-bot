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
      <Card variant="default" padding="lg" className={className}>
        <div className="text-center text-slate-400">
          <div className="text-xl mb-2">😕</div>
          <div>Failed to load leaderboard</div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <LoadingSpinner size="lg" text="Loading leaderboard..." />
      </div>
    );
  }

  if (!leaderboard?.length) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="text-center text-slate-400">
          <div className="text-xl mb-2">🏆</div>
          <div>No leaderboard data available</div>
        </div>
      </Card>
    );
  }

  // Calculate proper ranks
  const rankedEntries = calculateRanks(leaderboard);
  const topThree = rankedEntries.slice(0, 3);
  const restOfLeaderboard = rankedEntries.slice(3);

  return (
    <div className={className}>
      {/* Header with Stats */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          🏆 hall of fame
        </h1>
        <div className="text-slate-400 text-sm sm:text-base">
          tracking {totalUsers} legendary hunters • {totalDrops} drops found
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {topThree.map(({ entry, rank }, index) => (
            <Link
              key={entry.user_id}
              to={`/users/${entry.user_id}`}
              className="block group"
            >
              <PodiumCard
                entry={entry}
                position={(index + 1) as 1 | 2 | 3}
                className="group-hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              />
            </Link>
          ))}
        </div>
      )}

      {/* Rest of Leaderboard */}
      {restOfLeaderboard.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            🎖️ legendary hunters
          </h2>
          
          {restOfLeaderboard.map(({ entry, rank }) => (
            <Link
              key={entry.user_id}
              to={`/users/${entry.user_id}`}
              className="block group"
            >
              <LeaderboardCard
                entry={entry}
                rank={rank}
                className="group-hover:scale-[1.02] transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      )}

      {/* Additional Actions */}
      <div className="mt-8 text-center">
        <Button variant="ghost" size="sm">
          🔄 refresh leaderboard
        </Button>
      </div>
    </div>
  );
}); 
