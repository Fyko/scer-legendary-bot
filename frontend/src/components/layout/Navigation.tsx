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
    <nav className="sticky top-0 z-50 glass-effect-strong shadow-glass animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-2xl sm:text-3xl font-bold text-gradient-purple group-hover:scale-105 transition-transform duration-300">
              🏆 scer legendary board
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? 'primary' : 'ghost'}
                size="sm"
                className="font-medium"
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
