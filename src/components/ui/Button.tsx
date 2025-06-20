import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseClasses = cn(
      // Base styles for child-friendly design
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'min-h-[44px] min-w-[44px]', // Minimum touch targets for children
      'font-child', // Comic Neue font
      
      // Size variants
      {
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-base': size === 'md',
        'px-6 py-4 text-lg': size === 'lg',
        'px-8 py-5 text-xl': size === 'xl',
      },
      
      // Variant styles
      {
        // Primary - main brand blue gradient
        'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:-translate-y-1 focus:ring-primary-500':
          variant === 'primary',
        
        // Secondary - outline style
        'border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-50 focus:ring-primary-500':
          variant === 'secondary',
        
        // Success - green gradient for positive actions
        'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg hover:from-success-600 hover:to-success-700 hover:shadow-xl hover:-translate-y-1 focus:ring-success-500':
          variant === 'success',
        
        // Warning - orange gradient for attention
        'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg hover:from-warning-600 hover:to-warning-700 hover:shadow-xl hover:-translate-y-1 focus:ring-warning-500':
          variant === 'warning',
        
        // Outline - subtle border style
        'border-2 border-gray-300 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500':
          variant === 'outline',
        
        // Ghost - minimal style for less prominent actions
        'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500':
          variant === 'ghost',
      },
      
      className
    );

    return (
      <button
        className={baseClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };