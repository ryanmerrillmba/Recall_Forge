'use client';

import { HTMLAttributes, forwardRef, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Form Context for sharing form state
interface FormContextType {
  childFriendly?: boolean;
}

const FormContext = createContext<FormContextType>({});

export const useFormContext = () => useContext(FormContext);

// Form Root Component
export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  childFriendly?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, childFriendly = false, children, ...props }, ref) => {
    const formClasses = cn(
      'space-y-6',
      {
        'space-y-8': childFriendly, // More spacing for children
      },
      className
    );

    return (
      <FormContext.Provider value={{ childFriendly }}>
        <form className={formClasses} ref={ref} {...props}>
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

Form.displayName = 'Form';

// Form Field Component
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, required, error, helpText, children, ...props }, ref) => {
    const { childFriendly } = useFormContext();

    const fieldClasses = cn(
      'space-y-2',
      {
        'space-y-3': childFriendly,
      },
      className
    );

    const labelClasses = cn(
      'block font-medium',
      {
        'text-lg text-child-700 font-child': childFriendly,
        'text-sm text-gray-700': !childFriendly,
        'text-red-700': error,
      }
    );

    const helpTextClasses = cn(
      'text-sm',
      {
        'text-child-600 font-child': childFriendly && !error,
        'text-gray-600': !childFriendly && !error,
        'text-red-600': error,
      }
    );

    return (
      <div className={fieldClasses} ref={ref} {...props}>
        {label && (
          <label className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {children}
        {(helpText || error) && (
          <p className={helpTextClasses}>
            {error || helpText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Form Section Component (for grouping related fields)
export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    const { childFriendly } = useFormContext();

    const sectionClasses = cn(
      'space-y-4',
      {
        'space-y-6': childFriendly,
      },
      className
    );

    const titleClasses = cn(
      'font-semibold',
      {
        'text-xl text-child-700 font-child': childFriendly,
        'text-lg text-gray-900': !childFriendly,
      }
    );

    const descriptionClasses = cn(
      'text-sm',
      {
        'text-child-600 font-child': childFriendly,
        'text-gray-600': !childFriendly,
      }
    );

    return (
      <div className={sectionClasses} ref={ref} {...props}>
        {title && (
          <div className="space-y-1">
            <h3 className={titleClasses}>{title}</h3>
            {description && (
              <p className={descriptionClasses}>{description}</p>
            )}
          </div>
        )}
        <div className={cn('space-y-4', { 'space-y-6': childFriendly })}>
          {children}
        </div>
      </div>
    );
  }
);

FormSection.displayName = 'FormSection';

// Form Actions Component (for submit/cancel buttons)
export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
  stack?: boolean; // Stack buttons vertically on small screens
}

const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, align = 'right', stack = true, children, ...props }, ref) => {
    const { childFriendly } = useFormContext();

    const actionsClasses = cn(
      'flex gap-3',
      {
        // Alignment
        'justify-start': align === 'left',
        'justify-center': align === 'center',
        'justify-end': align === 'right',
        
        // Responsive stacking
        'flex-col sm:flex-row': stack,
        
        // Child-friendly spacing
        'gap-4': childFriendly,
        'pt-4': childFriendly,
      },
      className
    );

    return (
      <div className={actionsClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

FormActions.displayName = 'FormActions';

// Form Message Component (for success/error messages)
export interface FormMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const FormMessage = forwardRef<HTMLDivElement, FormMessageProps>(
  ({ 
    className, 
    variant = 'info', 
    title, 
    dismissible = false,
    onDismiss,
    children, 
    ...props 
  }, ref) => {
    const { childFriendly } = useFormContext();

    const messageClasses = cn(
      'p-4 rounded-lg border',
      {
        // Child-friendly: larger, more rounded
        'p-6 rounded-2xl': childFriendly,
        
        // Variants
        'bg-green-50 border-green-200 text-green-800': variant === 'success',
        'bg-red-50 border-red-200 text-red-800': variant === 'error',
        'bg-yellow-50 border-yellow-200 text-yellow-800': variant === 'warning',
        'bg-blue-50 border-blue-200 text-blue-800': variant === 'info',
      },
      className
    );

    const titleClasses = cn(
      'font-medium mb-1',
      {
        'text-lg font-child': childFriendly,
        'text-sm': !childFriendly,
      }
    );

    const contentClasses = cn(
      'text-sm',
      {
        'text-base font-child': childFriendly,
      }
    );

    const getIcon = () => {
      switch (variant) {
        case 'success':
          return '✅';
        case 'error':
          return '❌';
        case 'warning':
          return '⚠️';
        case 'info':
          return 'ℹ️';
        default:
          return null;
      }
    };

    return (
      <div className={messageClasses} ref={ref} {...props}>
        <div className="flex items-start">
          {childFriendly && (
            <span className="mr-3 text-lg">{getIcon()}</span>
          )}
          <div className="flex-1">
            {title && (
              <h4 className={titleClasses}>{title}</h4>
            )}
            {children && (
              <div className={contentClasses}>{children}</div>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={onDismiss}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormSection, FormActions, FormMessage };