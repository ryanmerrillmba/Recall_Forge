import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'deck' | 'question';
  hoverable?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, children, ...props }, ref) => {
    const baseClasses = cn(
      // Base card styles with child-friendly design
      'rounded-2xl transition-all duration-200 ease-in-out',
      
      // Variant styles
      {
        // Default card
        'bg-white border border-gray-200 shadow-sm': variant === 'default',
        
        // Elevated card with more prominent shadow
        'bg-white border border-gray-100 shadow-lg': variant === 'elevated',
        
        // Outlined card with stronger border
        'bg-white border-2 border-gray-300': variant === 'outlined',
        
        // Deck card - special styling for flashcard decks
        'bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-lg': variant === 'deck',
        
        // Question card - for displaying questions
        'bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl min-h-[200px] flex items-center justify-center text-center': variant === 'question',
      },
      
      // Hoverable effects for interactive cards
      hoverable && {
        'hover:shadow-xl hover:-translate-y-1 cursor-pointer': variant === 'default' || variant === 'outlined',
        'hover:shadow-2xl hover:-translate-y-2': variant === 'elevated' || variant === 'deck',
        'hover:shadow-2xl hover:scale-105': variant === 'question',
      },
      
      className
    );

    return (
      <div className={baseClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card content components for consistent spacing
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6 pb-2', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold leading-none tracking-tight font-child', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 leading-relaxed', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};