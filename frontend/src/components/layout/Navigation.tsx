import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Theme } from '../../types';

interface NavigationProps {
  theme: Theme;
  onThemeToggle: () => void;
}

/**
 * Main navigation component
 */
export const Navigation = memo(function Navigation({
  theme,
  onThemeToggle
}: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏆 scer legendary board
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? 'primary' : 'ghost'}
                size="sm"
              >
                Leaderboard
              </Button>
            </Link>
            
            <ThemeToggle
              theme={theme}
              onToggle={onThemeToggle}
              size="sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}); 
