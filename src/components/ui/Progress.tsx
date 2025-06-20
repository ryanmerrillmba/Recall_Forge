import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value, 
    variant = 'default', 
    size = 'md', 
    showLabel = false,
    label,
    animated = true,
    ...props 
  }, ref) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));
    
    const containerClasses = cn(
      'relative w-full rounded-full overflow-hidden',
      {
        'h-2': size === 'sm',
        'h-3': size === 'md',
        'h-4': size === 'lg',
      },
      'bg-gray-200',
      className
    );
    
    const fillClasses = cn(
      'h-full rounded-full transition-all duration-300 ease-out',
      animated && 'transition-all duration-500 ease-out',
      {
        // Default blue progress
        'bg-gradient-to-r from-primary-400 to-primary-500': variant === 'default',
        
        // Success green progress
        'bg-gradient-to-r from-success-400 to-success-500': variant === 'success',
        
        // Warning orange progress
        'bg-gradient-to-r from-warning-400 to-warning-500': variant === 'warning',
        
        // Multi-color gradient for celebrations
        'bg-gradient-to-r from-primary-400 via-success-400 to-warning-400': variant === 'gradient',
      }
    );

    return (
      <div className="space-y-2">
        {showLabel && (
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-700">{label}</span>
            <span className="text-gray-600">{Math.round(clampedValue)}%</span>
          </div>
        )}
        <div className={containerClasses} ref={ref} {...props}>
          <div
            className={fillClasses}
            style={{ width: `${clampedValue}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label || `Progress: ${Math.round(clampedValue)}%`}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Circular progress component for different use cases
export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  size?: number; // Size in pixels
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning';
  showLabel?: boolean;
}

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ 
    className, 
    value, 
    size = 64, 
    strokeWidth = 4,
    variant = 'default',
    showLabel = true,
    ...props 
  }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;
    
    const colorMap = {
      default: '#4A90E2',
      success: '#7ED321',
      warning: '#F5A623',
    };

    return (
      <div 
        className={cn('relative inline-flex items-center justify-center', className)} 
        ref={ref} 
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorMap[variant]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showLabel && (
          <span className="absolute text-sm font-semibold text-gray-700">
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

export { Progress, CircularProgress };