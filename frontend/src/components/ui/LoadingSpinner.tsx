import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div 
        className={`
          ${sizeClass} 
          border-2 border-purple-500/30 border-t-purple-500 
          rounded-full 
          animate-spin
        `} 
      />
      {text && (
        <span className="text-slate-300 text-sm sm:text-base">
          {text}
        </span>
      )}
    </div>
  );
}); 
