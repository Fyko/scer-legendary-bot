import { memo } from 'react';
import { Button } from './Button';
import type { Theme } from '../../types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Theme toggle button component
 */
export const ThemeToggle = memo(function ThemeToggle({
  theme,
  onToggle,
  size = 'md'
}: ThemeToggleProps) {
  return (
    <Button
      variant="secondary"
      size={size}
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="aspect-square"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}); 
