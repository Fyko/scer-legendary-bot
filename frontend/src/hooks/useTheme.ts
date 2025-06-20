import { useState, useEffect } from 'react';
import { THEME_CONFIG, log } from '../constants/config';
import type { Theme } from '../types';

/**
 * Custom hook for theme management
 * Handles theme persistence and DOM updates
 */
export function useTheme() {
  // Initialize theme from localStorage or default
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark')) {
        log('Loaded theme from localStorage:', stored);
        return stored;
      }
    } catch (error) {
      log('Failed to load theme from localStorage:', error);
    }
    return THEME_CONFIG.DEFAULT_THEME;
  });

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    try {
      // Update DOM class
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Persist to localStorage
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, theme);
      log('Theme updated:', theme);
      
    } catch (error) {
      log('Failed to update theme:', error);
    }
  }, [theme]);

  // Theme toggle function
  const toggleTheme = () => {
    setThemeState(current => current === 'light' ? 'dark' : 'light');
  };

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
} 
