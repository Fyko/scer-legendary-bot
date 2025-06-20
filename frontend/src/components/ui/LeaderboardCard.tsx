import { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import type { LeaderboardEntry } from '../../types';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
  className?: string;
}

/**
 * Individual leaderboard card component for non-podium entries
 */
export const LeaderboardCard = memo(function LeaderboardCard({
  entry,
  rank,
  className = ''
}: LeaderboardCardProps) {
  const getRankStyling = (position: number) => {
    if (position <= 10) {
      return {
        rankBg: 'bg-gradient-to-r from-accent-purple/80 to-accent-pink/80',
        rankText: 'text-white font-bold',
        borderGlow: 'group-hover:border-accent-purple/50'
      };
    }
    return {
      rankBg: 'bg-slate-700/80',
      rankText: 'text-slate-300 font-semibold',
      borderGlow: 'group-hover:border-slate-500/50'
    };
  };

  const styling = getRankStyling(rank);

  return (
    <Card 
      variant="glass" 
      padding="md" 
      hover={true}
      className={`group transition-all duration-300 ${styling.borderGlow} ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Rank indicator */}
        <div className={`
          w-10 h-10 sm:w-12 sm:h-12 
          ${styling.rankBg} 
          rounded-xl 
          flex items-center justify-center 
          shadow-lg
          group-hover:scale-110 transition-transform duration-300
        `}>
          <span className={`text-sm sm:text-base ${styling.rankText}`}>
            {rank}
          </span>
        </div>

        {/* Avatar */}
        <Avatar
          src={entry.avatar_url}
          alt={`${entry.display_name}'s avatar`}
          size="md"
          borderColor="border-slate-600/50 group-hover:border-accent-purple/50"
          className="group-hover:scale-105 transition-all duration-300"
        />

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-base sm:text-lg mb-1 group-hover:text-accent-purple transition-colors duration-300">
            {entry.display_name}
          </div>
          <div className="text-slate-400 text-sm font-medium">
            Rank #{rank}
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div className="font-bold text-xl sm:text-2xl text-accent-purple group-hover:text-accent-pink transition-colors duration-300">
            {entry.total}
          </div>
          <div className="text-slate-500 text-xs sm:text-sm font-medium">
            {entry.total === 1 ? 'leggy' : 'leggies'}
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <span className="text-accent-purple text-lg">→</span>
        </div>
      </div>
    </Card>
  );
}); 
