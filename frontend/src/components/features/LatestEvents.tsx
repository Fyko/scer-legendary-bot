import { memo } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../ui/EventCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { useLatestEvents } from '../../hooks/useLatestEvents';

interface LatestEventsProps {
  className?: string;
}

/**
 * Latest events/drops section component with live updates
 */
export const LatestEvents = memo(function LatestEvents({
  className = ''
}: LatestEventsProps) {
  const { events, isLoading, error } = useLatestEvents();

  if (error) {
    return (
      <Card variant="glass" padding="lg" className={`text-center animate-fade-in ${className}`}>
        <div className="text-slate-400 space-y-3">
          <div className="text-3xl mb-3">📡</div>
          <div className="text-base font-medium text-white">connection lost</div>
          <div className="text-sm">unable to fetch latest drops</div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section header */}
      <div className="animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center gap-3">
          ⚡ latest drops
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="text-sm text-slate-400 font-normal">live</span>
          </div>
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          {isLoading ? 'fetching latest activity...' : 'real-time legendary discoveries'}
        </p>
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-fade-in">
            <LoadingSpinner size="md" text="loading latest drops..." />
          </div>
        ) : events?.length ? (
          <>
            {events.map((event, index) => (
              <div
                key={`${event.user.id}-${event.created_at}`}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link
                  to={`/users/${event.user.id}`}
                  className="block group"
                >
                  <EventCard event={event} />
                </Link>
              </div>
            ))}
            {events.length === 0 && (
              <Card variant="glass" padding="md" className="text-center animate-fade-in">
                <div className="text-slate-400 space-y-2">
                  <div className="text-2xl mb-2">🌟</div>
                  <div className="text-sm font-medium">no recent drops</div>
                  <div className="text-xs">check back soon for new legendaries!</div>
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card variant="glass" padding="md" className="text-center animate-fade-in">
            <div className="text-slate-400 space-y-2">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-sm font-medium">no recent drops</div>
              <div className="text-xs">check back soon for new legendaries!</div>
            </div>
          </Card>
        )}
      </div>

      {/* Footer info */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-effect rounded-xl p-4 border border-glass-100 shadow-glass">
          <div className="text-center text-xs text-slate-500 space-y-1">
            <div>updates every few seconds</div>
            <div className="flex items-center justify-center gap-2">
              <span>powered by</span>
              <span className="text-accent-purple font-medium">scer legendary tracker</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}); 
