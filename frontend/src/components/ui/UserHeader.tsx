import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import type { User } from '../../types';

interface UserHeaderProps {
  user: User;
  totalLeggies: number;
  rank?: number;
  className?: string;
}

/**
 * User profile header component
 */
export const UserHeader = memo(function UserHeader({
  user,
  totalLeggies,
  rank,
  className = ''
}: UserHeaderProps) {
  return (
    <Card variant="gradient" padding="lg" className={className}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <Avatar
          src={user.avatar_url}
          alt={`${user.username}'s avatar`}
          size="xl"
          showStatus={true}
          statusColor="from-purple-400 to-pink-400"
        />

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {user.username}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
            {rank && (
              <Badge variant="number" size="sm">
                #{rank}
              </Badge>
            )}
            <div className="text-slate-400">
              legendary hunter
            </div>
          </div>

          {/* Stats */}
          <div className="bg-black/30 rounded-2xl p-4 mb-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-1">
                {totalLeggies}
              </div>
              <div className="text-slate-400 text-sm sm:text-base">
                {totalLeggies === 1 ? 'legendary drop' : 'legendary drops'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <Link to="/">
              <Button variant="secondary" size="sm">
                ← back to leaderboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              🔄 refresh data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}); 
