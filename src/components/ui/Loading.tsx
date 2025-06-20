'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Spinner Component
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'child';
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'primary', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const colorClasses = {
      primary: 'text-primary-500',
      secondary: 'text-gray-500',
      child: 'text-success-500',
    };

    const spinnerClasses = cn(
      'animate-spin',
      sizeClasses[size],
      colorClasses[variant],
      className
    );

    return (
      <div className={spinnerClasses} ref={ref} {...props}>
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

// Loading Overlay Component
export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  message?: string;
  childFriendly?: boolean;
  backdrop?: boolean;
}

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    className, 
    isLoading = true, 
    message, 
    childFriendly = false,
    backdrop = true,
    children,
    ...props 
  }, ref) => {
    if (!isLoading) {
      return <>{children}</>;
    }

    const overlayClasses = cn(
      'absolute inset-0 flex items-center justify-center z-50',
      {
        'bg-white/80 backdrop-blur-sm': backdrop,
      },
      className
    );

    const contentClasses = cn(
      'flex flex-col items-center space-y-4 p-6',
      {
        'bg-white rounded-2xl shadow-xl border': childFriendly,
        'bg-white/90 rounded-lg shadow-lg': !childFriendly,
      }
    );

    const messageClasses = cn(
      'text-center',
      {
        'text-lg font-child text-child-700': childFriendly,
        'text-sm text-gray-600': !childFriendly,
      }
    );

    return (
      <div className="relative">
        {children}
        <div className={overlayClasses} ref={ref} {...props}>
          <div className={contentClasses}>
            <Spinner 
              size={childFriendly ? 'xl' : 'lg'} 
              variant={childFriendly ? 'child' : 'primary'} 
            />
            {message && (
              <p className={messageClasses}>
                {childFriendly && '🔄 '}{message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

// Loading Button State Component
export interface LoadingButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  childFriendly?: boolean;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className, 
    isLoading = false, 
    loadingText = 'Loading...',
    disabled,
    variant = 'primary',
    size = 'md',
    childFriendly = false,
    children,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading;

    const buttonClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      
      // Size classes
      {
        'px-3 py-2 text-sm rounded-lg min-h-[36px]': size === 'sm' && !childFriendly,
        'px-4 py-2 text-base rounded-lg min-h-[40px]': size === 'md' && !childFriendly,
        'px-6 py-3 text-lg rounded-lg min-h-[48px]': size === 'lg' && !childFriendly,
        'px-8 py-4 text-xl rounded-lg min-h-[56px]': size === 'xl' && !childFriendly,
        
        // Child-friendly sizes (larger, more rounded)
        'px-6 py-4 text-lg rounded-2xl min-h-[56px] font-child': childFriendly && size === 'md',
        'px-8 py-5 text-xl rounded-2xl min-h-[64px] font-child': childFriendly && (size === 'lg' || size === 'xl'),
      },
      
      // Variant styles
      {
        // Primary
        'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg': 
          variant === 'primary',
        
        // Secondary
        'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 shadow-lg': 
          variant === 'secondary',
        
        // Outline
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500': 
          variant === 'outline',
        
        // Ghost
        'text-primary-500 hover:bg-primary-50 focus:ring-primary-500': 
          variant === 'ghost',
      },
      
      // Child-friendly enhancements
      {
        'shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95': childFriendly,
      },
      
      className
    );

    return (
      <button
        className={buttonClasses}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Spinner 
            size={size === 'sm' ? 'sm' : 'md'} 
            variant={variant === 'primary' ? 'secondary' : 'primary'}
            className="mr-2"
          />
        )}
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

// Loading Card/Skeleton Component
export interface LoadingCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'compact' | 'detailed';
  childFriendly?: boolean;
}

const LoadingCard = forwardRef<HTMLDivElement, LoadingCardProps>(
  ({ className, variant = 'default', childFriendly = false, ...props }, ref) => {
    const cardClasses = cn(
      'animate-pulse bg-white border rounded-lg p-6',
      {
        'rounded-2xl shadow-xl border-2': childFriendly,
        'shadow-md': !childFriendly,
      },
      className
    );

    const skeletonClasses = cn(
      'bg-gray-200 rounded',
      {
        'bg-gray-100': childFriendly,
      }
    );

    return (
      <div className={cardClasses} ref={ref} {...props}>
        {variant === 'compact' && (
          <div className="space-y-3">
            <div className={cn(skeletonClasses, 'h-4 w-3/4')} />
            <div className={cn(skeletonClasses, 'h-3 w-1/2')} />
          </div>
        )}
        
        {variant === 'default' && (
          <div className="space-y-4">
            <div className={cn(skeletonClasses, 'h-6 w-2/3')} />
            <div className="space-y-2">
              <div className={cn(skeletonClasses, 'h-4 w-full')} />
              <div className={cn(skeletonClasses, 'h-4 w-5/6')} />
              <div className={cn(skeletonClasses, 'h-4 w-4/6')} />
            </div>
            <div className="flex space-x-2">
              <div className={cn(skeletonClasses, 'h-8 w-20')} />
              <div className={cn(skeletonClasses, 'h-8 w-16')} />
            </div>
          </div>
        )}
        
        {variant === 'detailed' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={cn(skeletonClasses, 'h-12 w-12 rounded-full')} />
              <div className="space-y-2 flex-1">
                <div className={cn(skeletonClasses, 'h-4 w-1/3')} />
                <div className={cn(skeletonClasses, 'h-3 w-1/4')} />
              </div>
            </div>
            <div className="space-y-3">
              <div className={cn(skeletonClasses, 'h-4 w-full')} />
              <div className={cn(skeletonClasses, 'h-4 w-5/6')} />
              <div className={cn(skeletonClasses, 'h-4 w-4/6')} />
            </div>
            <div className="flex justify-between">
              <div className={cn(skeletonClasses, 'h-8 w-24')} />
              <div className={cn(skeletonClasses, 'h-8 w-20')} />
            </div>
          </div>
        )}
      </div>
    );
  }
);

LoadingCard.displayName = 'LoadingCard';

export { Spinner, LoadingOverlay, LoadingButton, LoadingCard };