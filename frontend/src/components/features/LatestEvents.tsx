import { memo } from 'react';
import { EventCard } from '../ui/EventCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { useLatestEvents } from '../../hooks/useLatestEvents';

interface LatestEventsProps {
  className?: string;
}

/**
 * Latest events section component
 */
export const LatestEvents = memo(function LatestEvents({
  className = ''
}: LatestEventsProps) {
  const { 
    events, 
    isLoading, 
    error, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
  } = useLatestEvents();

  if (error) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="text-center text-slate-400">
          <div className="text-xl mb-2">😕</div>
          <div>Failed to load latest events</div>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          💫 latest drops
        </h2>
        <div className="text-sm text-slate-400">
          live updates
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3 sm:space-y-4">
        {isLoading && events.length === 0 ? (
          <LoadingSpinner size="lg" text="Loading latest events..." />
        ) : (
          <>
            {events.map((event, index) => (
              <EventCard
                key={`${event.id}-${index}`}
                event={event}
              />
            ))}
            
            {/* Load More */}
            {hasNextPage && (
              <div className="pt-4">
                <Card 
                  variant="glass" 
                  padding="md" 
                  className="text-center cursor-pointer hover:bg-white/5 transition-all duration-300"
                  onClick={() => fetchNextPage()}
                >
                  {isFetchingNextPage ? (
                    <LoadingSpinner size="sm" text="Loading more..." />
                  ) : (
                    <div className="text-purple-400 font-medium">
                      🔄 load more events
                    </div>
                  )}
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}); 
