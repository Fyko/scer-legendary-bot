import { memo } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import type { LatestEvent } from '../../types';
import { getRelativeTime, getShortRelativeTime } from '../../utils/date';

interface UserEventCardProps {
  event: LatestEvent;
  showIndex?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Individual user event card component
 */
export const UserEventCard = memo(function UserEventCard({
  event,
  showIndex = true,
  compact = false,
  className = ''
}: UserEventCardProps) {
  return (
    <Card 
      variant="glass" 
      padding={compact ? "sm" : "md"} 
      className={`group ${className}`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Index Badge */}
        {showIndex && (
          <Badge variant="purple" size={compact ? "sm" : "md"}>
            #{event.index}
          </Badge>
        )}

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
            <span className="truncate">
              legendary drop secured ✨
            </span>
          </div>
          
          <div className="text-xs sm:text-sm text-slate-500">
            {compact ? getShortRelativeTime(event.created_at) : getRelativeTime(event.created_at)}
          </div>
        </div>

        {/* External Link */}
        <div className="flex-shrink-0">
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              🔗
            </div>
          </a>
        </div>
      </div>
    </Card>
  );
}); 
