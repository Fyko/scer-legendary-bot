import { memo, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'solid' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const variantClasses = {
  default: 'bg-black/30 backdrop-blur-xl border-white/10',
  glass: 'bg-black/20 backdrop-blur-xl border-white/10',
  solid: 'bg-slate-800 border-slate-700',
  gradient: 'bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border-white/20'
};

const paddingClasses = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8 lg:p-10'
};

/**
 * Reusable Card component as base for other components
 */
export const Card = memo(function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false
}: CardProps) {
  const variantClass = variantClasses[variant];
  const paddingClass = paddingClasses[padding];
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        ${variantClass}
        ${paddingClass}
        rounded-2xl sm:rounded-3xl 
        border 
        shadow-2xl 
        ${hover || isClickable ? 'hover:bg-white/5 transition-all duration-300' : ''}
        ${isClickable ? 'cursor-pointer group' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}); 
