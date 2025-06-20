import { memo, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'purple' | 'gold' | 'silver' | 'bronze' | 'number';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  default: 'bg-gradient-to-r from-purple-500 to-pink-500',
  purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
  gold: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  silver: 'bg-gradient-to-r from-slate-300 to-slate-500',
  bronze: 'bg-gradient-to-r from-amber-500 to-orange-600',
  number: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
};

const sizeClasses = {
  sm: 'w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm',
  md: 'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base',
  lg: 'w-12 h-12 sm:w-16 sm:h-16 text-base sm:text-lg'
};

/**
 * Reusable Badge component for numbers and status indicators
 */
export const Badge = memo(function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <div 
      className={`
        ${sizeClass}
        ${variantClass}
        rounded-full 
        flex items-center justify-center 
        text-white font-bold 
        flex-shrink-0
        ${className}
      `}
    >
      {children}
    </div>
  );
}); 
