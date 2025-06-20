'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'child' | 'error' | 'success';
  childFriendly?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    variant = 'default', 
    childFriendly = false,
    label,
    helperText,
    errorText,
    icon,
    iconPosition = 'left',
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Use child variant automatically if childFriendly is true
    const actualVariant = childFriendly ? 'child' : variant;
    
    const inputClasses = cn(
      // Base styles
      'w-full transition-all duration-200 ease-in-out',
      'border border-gray-300 bg-white text-gray-900',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      
      // Size and spacing
      {
        // Child-friendly: larger, more rounded
        'px-6 py-4 text-lg rounded-2xl min-h-[56px]': actualVariant === 'child',
        // Standard size
        'px-4 py-3 text-base rounded-lg min-h-[44px]': actualVariant !== 'child',
      },
      
      // Font
      {
        'font-child': actualVariant === 'child',
        'font-sans': actualVariant !== 'child',
      },
      
      // Icon spacing
      {
        'pl-12': icon && iconPosition === 'left' && actualVariant !== 'child',
        'pr-12': icon && iconPosition === 'right' && actualVariant !== 'child',
        'pl-14': icon && iconPosition === 'left' && actualVariant === 'child',
        'pr-14': icon && iconPosition === 'right' && actualVariant === 'child',
      },
      
      // Variant styles
      {
        // Default
        'border-gray-300 focus:ring-primary-500 focus:border-primary-500': 
          actualVariant === 'default',
        
        // Child-friendly with bright colors
        'border-primary-200 focus:ring-primary-400 focus:border-primary-400 shadow-lg': 
          actualVariant === 'child',
        
        // Error state
        'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50': 
          actualVariant === 'error' || errorText,
        
        // Success state
        'border-success-300 focus:ring-success-500 focus:border-success-500 bg-success-50': 
          actualVariant === 'success',
      },
      
      // Disabled state
      {
        'bg-gray-50 text-gray-500 cursor-not-allowed opacity-60': disabled,
      },
      
      // Focus glow for child-friendly
      {
        'focus:shadow-xl focus:shadow-primary-200/50': actualVariant === 'child' && isFocused,
      },
      
      className
    );

    const containerClasses = cn(
      'relative w-full',
      {
        'space-y-2': label || helperText || errorText,
      }
    );

    const labelClasses = cn(
      'block font-medium mb-2',
      {
        'text-lg text-child-700 font-child': actualVariant === 'child',
        'text-sm text-gray-700': actualVariant !== 'child',
        'text-red-700': errorText,
      }
    );

    const helperClasses = cn(
      'text-sm',
      {
        'text-child-600 font-child': actualVariant === 'child',
        'text-gray-600': actualVariant !== 'child' && !errorText,
        'text-red-600': errorText,
      }
    );

    const iconClasses = cn(
      'absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none',
      {
        'left-4 w-5 h-5': iconPosition === 'left' && actualVariant !== 'child',
        'right-4 w-5 h-5': iconPosition === 'right' && actualVariant !== 'child',
        'left-5 w-6 h-6': iconPosition === 'left' && actualVariant === 'child',
        'right-5 w-6 h-6': iconPosition === 'right' && actualVariant === 'child',
      }
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className={labelClasses}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {icon && (
            <div className={iconClasses}>
              {icon}
            </div>
          )}
        </div>
        
        {(helperText || errorText) && (
          <p className={helperClasses}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'child' | 'error' | 'success';
  childFriendly?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default', 
    childFriendly = false,
    label,
    helperText,
    errorText,
    disabled,
    rows = 4,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Use child variant automatically if childFriendly is true
    const actualVariant = childFriendly ? 'child' : variant;
    
    const textareaClasses = cn(
      // Base styles
      'w-full transition-all duration-200 ease-in-out resize-vertical',
      'border border-gray-300 bg-white text-gray-900',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      
      // Size and spacing
      {
        // Child-friendly: larger, more rounded
        'px-6 py-4 text-lg rounded-2xl': actualVariant === 'child',
        // Standard size
        'px-4 py-3 text-base rounded-lg': actualVariant !== 'child',
      },
      
      // Font
      {
        'font-child': actualVariant === 'child',
        'font-sans': actualVariant !== 'child',
      },
      
      // Variant styles
      {
        // Default
        'border-gray-300 focus:ring-primary-500 focus:border-primary-500': 
          actualVariant === 'default',
        
        // Child-friendly with bright colors
        'border-primary-200 focus:ring-primary-400 focus:border-primary-400 shadow-lg': 
          actualVariant === 'child',
        
        // Error state
        'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50': 
          actualVariant === 'error' || errorText,
        
        // Success state
        'border-success-300 focus:ring-success-500 focus:border-success-500 bg-success-50': 
          actualVariant === 'success',
      },
      
      // Disabled state
      {
        'bg-gray-50 text-gray-500 cursor-not-allowed opacity-60': disabled,
      },
      
      // Focus glow for child-friendly
      {
        'focus:shadow-xl focus:shadow-primary-200/50': actualVariant === 'child' && isFocused,
      },
      
      className
    );

    const containerClasses = cn(
      'relative w-full',
      {
        'space-y-2': label || helperText || errorText,
      }
    );

    const labelClasses = cn(
      'block font-medium mb-2',
      {
        'text-lg text-child-700 font-child': actualVariant === 'child',
        'text-sm text-gray-700': actualVariant !== 'child',
        'text-red-700': errorText,
      }
    );

    const helperClasses = cn(
      'text-sm',
      {
        'text-child-600 font-child': actualVariant === 'child',
        'text-gray-600': actualVariant !== 'child' && !errorText,
        'text-red-600': errorText,
      }
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className={labelClasses}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          className={textareaClasses}
          ref={ref}
          disabled={disabled}
          rows={rows}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {(helperText || errorText) && (
          <p className={helperClasses}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };