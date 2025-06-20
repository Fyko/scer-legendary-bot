import { memo } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  statusColor?: string;
  className?: string;
  borderColor?: string;
  onError?: () => void;
}

const sizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10 sm:w-12 sm:h-12',
  md: 'w-12 h-12 sm:w-16 sm:h-16',
  lg: 'w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20',
  xl: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24'
};

const statusSizeClasses = {
  xs: 'w-2 h-2',
  sm: 'w-3 h-3 sm:w-4 sm:h-4',
  md: 'w-4 h-4 sm:w-6 sm:h-6',
  lg: 'w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7',
  xl: 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8'
};

/**
 * Reusable Avatar component with optional status indicator
 */
export const Avatar = memo(function Avatar({
  src,
  alt,
  size = 'md',
  showStatus = false,
  statusColor = 'from-green-400 to-emerald-500',
  className = '',
  borderColor = 'border-purple-500/50',
  onError
}: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const statusSizeClass = statusSizeClasses[size];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={onError}
        className={`
          ${sizeClass} 
          rounded-xl sm:rounded-2xl 
          border-2 ${borderColor} 
          transition-all duration-300
          object-cover
        `}
      />
      {showStatus && (
        <div 
          className={`
            absolute -top-1 -right-1 
            ${statusSizeClass} 
            bg-gradient-to-r ${statusColor} 
            rounded-full 
            border-2 border-slate-900
          `}
        />
      )}
    </div>
  );
}); 
