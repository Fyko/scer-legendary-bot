import { memo } from 'react';
import { UserEventCard } from '../ui/UserEventCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUserLeggies } from '../../hooks/useUserLeggies';

interface UserEventsListProps {
  userId: string;
  className?: string;
}

/**
 * User events list component
 */
export const UserEventsList = memo(function UserEventsList({
  userId,
  className = ''
}: UserEventsListProps) {
  const { userLeggies, isLoading, error, refetch } = useUserLeggies(userId);

  if (error) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="text-center text-slate-400">
          <div className="text-xl mb-2">😕</div>
          <div>Failed to load user events</div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-4"
          >
            try again
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <LoadingSpinner size="lg" text="Loading legendary drops..." />
      </div>
    );
  }

  if (!userLeggies?.length) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="text-center text-slate-400">
          <div className="text-xl mb-2">🎯</div>
          <div>No legendary drops found</div>
          <div className="text-sm text-slate-500 mt-2">
            time to start hunting!
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          🏆 legendary timeline
        </h2>
        <div className="text-sm text-slate-400">
          {userLeggies.length} {userLeggies.length === 1 ? 'drop' : 'drops'}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3 sm:space-y-4">
        {userLeggies.map((event, index) => (
          <UserEventCard
            key={`${event.id}-${index}`}
            event={event}
            showIndex={true}
            compact={userLeggies.length > 10}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 text-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => refetch()}
        >
          🔄 refresh timeline
        </Button>
      </div>
    </div>
  );
}); 
