import { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
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
        borderColor: 'border-accent-gold/70',
        bgGradient: 'from-accent-gold/20 via-yellow-500/15 to-accent-gold-dark/20',
        glowColor: 'shadow-[0_0_40px_rgba(255,215,0,0.3)]',
        textColor: 'text-gradient-gold',
        emoji: '👑',
        title: 'LEGENDARY EMPEROR',
        rankBg: 'bg-gradient-to-r from-accent-gold to-yellow-400'
      },
      2: {
        variant: 'silver' as const,
        borderColor: 'border-accent-silver/70',
        bgGradient: 'from-accent-silver/20 via-slate-300/15 to-accent-silver-dark/20',
        glowColor: 'shadow-[0_0_30px_rgba(192,192,192,0.25)]',
        textColor: 'text-gradient-silver',
        emoji: '🥈',
        title: 'SILVER SAGE',
        rankBg: 'bg-gradient-to-r from-accent-silver to-slate-400'
      },
      3: {
        variant: 'bronze' as const,
        borderColor: 'border-accent-bronze/70',
        bgGradient: 'from-accent-bronze/20 via-orange-500/15 to-accent-bronze-dark/20',
        glowColor: 'shadow-[0_0_30px_rgba(205,127,50,0.25)]',
        textColor: 'text-gradient-bronze',
        emoji: '🥉',
        title: 'BRONZE WARRIOR',
        rankBg: 'bg-gradient-to-r from-accent-bronze to-orange-500'
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
        backdrop-blur-2xl 
        border-2 ${config.borderColor}
        ${config.glowColor}
        hover:${config.glowColor.replace('0.3', '0.5').replace('0.25', '0.4')}
        group relative overflow-hidden
        ${className}
      `}
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="text-center space-y-6 relative z-10">
        {/* Position indicator - bigger emoji, no backdrop */}
        <div className="flex justify-center">
          <div className="text-6xl">
            {config.emoji}
          </div>
        </div>

        {/* Avatar - clean without gradient ring */}
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
            className="shadow-2xl"
          />
        </div>

        {/* User info with enhanced typography */}
        <div className="space-y-2">
          <div className="font-bold text-white text-xl sm:text-2xl mb-2 tracking-tight">
            {entry.display_name}
          </div>
          <div className={`text-sm sm:text-base font-bold ${config.textColor} mb-3 tracking-wider`}>
            {config.title}
          </div>
          <div className="text-slate-400 text-sm font-medium">
            Position #{position}
          </div>
        </div>

        {/* Stats with better padding */}
        <div className="pt-4 border-t border-white/20 pb-2">
          <div className={`font-black text-4xl sm:text-5xl ${config.textColor} mb-3 tracking-tight`}>
            {entry.total}
          </div>
          <div className="text-slate-300 text-sm sm:text-base font-medium pb-2">
            {entry.total === 1 ? 'legendary' : 'legendaries'}
          </div>
        </div>
      </div>
    </Card>
  );
}); 
