import { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import type { LeaderboardEntry } from '../../types';

interface PodiumCardProps {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
  className?: string;
}

/**
 * Podium card for top 3 players display
 */
export const PodiumCard = memo(function PodiumCard({
  entry,
  position,
  className = ''
}: PodiumCardProps) {
  const getPositionConfig = (pos: 1 | 2 | 3) => {
    const configs = {
      1: {
        variant: 'gold' as const,
        borderColor: 'border-yellow-500/70',
        bgGradient: 'from-yellow-500/20 to-amber-500/20',
        textColor: 'text-yellow-400',
        emoji: '👑',
        title: 'LEGENDARY EMPEROR'
      },
      2: {
        variant: 'silver' as const,
        borderColor: 'border-slate-400/70',
        bgGradient: 'from-slate-300/20 to-slate-500/20',
        textColor: 'text-slate-300',
        emoji: '🥈',
        title: 'SILVER SAGE'
      },
      3: {
        variant: 'bronze' as const,
        borderColor: 'border-orange-500/70',
        bgGradient: 'from-amber-500/20 to-orange-600/20',
        textColor: 'text-orange-400',
        emoji: '🥉',
        title: 'BRONZE WARRIOR'
      }
    };
    return configs[pos];
  };

  const config = getPositionConfig(position);

  return (
    <Card 
      variant="gradient" 
      padding="lg"
      className={`
        bg-gradient-to-br ${config.bgGradient} 
        backdrop-blur-xl 
        border-2 ${config.borderColor}
        ${className}
      `}
    >
      <div className="text-center space-y-4">
        {/* Position indicator */}
        <div className="flex justify-center">
          <Badge variant={config.variant} size="lg">
            {config.emoji}
          </Badge>
        </div>

        {/* Avatar */}
        <div className="flex justify-center">
                   <Avatar
           src={entry.avatar_url}
           alt={`${entry.display_name}'s avatar`}
           size="xl"
           borderColor={config.borderColor}
           showStatus={true}
           statusColor={config.variant === 'gold' ? 'from-yellow-400 to-amber-500' : 
                       config.variant === 'silver' ? 'from-slate-300 to-slate-500' : 
                       'from-amber-500 to-orange-600'}
         />
       </div>

       {/* User info */}
       <div>
         <div className="font-bold text-white text-lg sm:text-xl mb-1">
           {entry.display_name}
         </div>
         <div className={`text-xs sm:text-sm font-semibold ${config.textColor} mb-2`}>
           {config.title}
         </div>
         <div className="text-slate-400 text-xs sm:text-sm">
           Position #{position}
         </div>
       </div>

       {/* Stats */}
       <div className="pt-2 border-t border-white/10">
         <div className={`font-bold text-2xl sm:text-3xl ${config.textColor}`}>
           {entry.total}
         </div>
         <div className="text-slate-400 text-xs sm:text-sm">
           {entry.total === 1 ? 'legendary' : 'legendaries'}
         </div>
       </div>
      </div>
    </Card>
  );
}); 
