import { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import type { LeaderboardEntry } from '../../types';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
  className?: string;
}

/**
 * Individual leaderboard entry card component
 */
export const LeaderboardCard = memo(function LeaderboardCard({
  entry,
  rank,
  className = ''
}: LeaderboardCardProps) {
  const getRankVariant = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'number';
  };

  const getRankBorderColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-500/70';
    if (rank === 2) return 'border-slate-400/70';
    if (rank === 3) return 'border-orange-500/70';
    return 'border-purple-500/50';
  };

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-center gap-3 sm:gap-4">
        <Badge
          variant={getRankVariant(rank)}
          size="md"
          className="text-xs sm:text-sm font-bold"
        >
          {rank <= 3 ? (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉') : rank}
        </Badge>

        <Avatar
          src={entry.avatar_url}
          alt={`${entry.display_name}'s avatar`}
          size="md"
          borderColor={getRankBorderColor(rank)}
        />

        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm sm:text-base lg:text-lg truncate">
            {entry.display_name}
          </div>
          <div className="text-slate-400 text-xs sm:text-sm">
            Rank #{rank}
          </div>
        </div>

        <div className="text-right">
          <div className="font-bold text-purple-400 text-base sm:text-lg lg:text-xl">
            {entry.total}
          </div>
          <div className="text-slate-400 text-xs sm:text-sm">
            {entry.total === 1 ? 'leggy' : 'leggies'}
          </div>
        </div>
      </div>
    </Card>
  );
}); 
