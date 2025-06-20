import { memo, ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-transparent',
  secondary: 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white',
  ghost: 'bg-transparent hover:bg-white/5 border-transparent text-slate-300 hover:text-white',
  link: 'bg-transparent hover:bg-transparent border-transparent text-purple-400 hover:text-purple-300 p-0'
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-3 text-base rounded-xl',
  lg: 'px-6 py-4 text-lg rounded-2xl'
};

/**
 * Reusable Button component with variants and loading states
 */
export const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = variant === 'link' ? '' : sizeClasses[size];
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        ${variantClass}
        ${sizeClass}
        border
        transition-all duration-300 
        hover:scale-105 
        flex items-center justify-center gap-2
        flex-shrink-0
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        disabled:transform-none
        ${className}
      `}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}); 
