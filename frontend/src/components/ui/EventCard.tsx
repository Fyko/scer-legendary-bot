import { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import type { LatestEvent } from '../../types';
import { getRelativeTime } from '../../utils/date';

interface EventCardProps {
  event: LatestEvent;
  className?: string;
}

/**
 * Individual event card component for the latest events section
 */
export const EventCard = memo(function EventCard({
  event,
  className = ''
}: EventCardProps) {
  return (
    <Card variant="glass" padding="md" className={className}>
      <div className="flex items-center gap-3 sm:gap-4">
        <Avatar
          src={event.user.avatar_url}
          alt={`${event.user.username}'s avatar`}
          size="sm"
          borderColor="border-green-500/50"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce flex-shrink-0" />
            <span className="truncate">
              <span className="text-white font-medium">{event.user.username}</span>
              {' '}pulled a legendary!
            </span>
          </div>
          
          <div className="text-xs sm:text-sm text-slate-500 mt-1">
            {getRelativeTime(event.created_at)}
          </div>
        </div>
      </div>
    </Card>
  );
}); 
