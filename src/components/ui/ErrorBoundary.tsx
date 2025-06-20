'use client';

import React from 'react';

// Temporary mock for Sentry until re-integration
const Sentry = {
  captureException: (error: Error, options?: any) => {
    console.error('Error captured:', error);
    return 'mock-error-id';
  },
};

interface ErrorBoundaryState {
  hasError: boolean;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ errorId?: string; retry: () => void }>;
  level?: 'page' | 'component' | 'critical';
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture error to Sentry with child-safe context
    const errorId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
          level: this.props.level || 'component',
        },
      },
      tags: {
        errorBoundary: true,
        childSafe: true,
        level: this.props.level || 'component',
      },
      level: this.props.level === 'critical' ? 'error' : 'warning',
    });

    this.setState({ errorId });

    // Log child-friendly error message
    console.error('Something went wrong in the learning app:', {
      errorId,
      level: this.props.level,
      message: 'A learning component had trouble loading',
    });
  }

  retry = () => {
    this.setState({ hasError: false, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default child-friendly error
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent errorId={this.state.errorId} retry={this.retry} />;
      }

      // Default child-friendly error UI
      return <ChildFriendlyErrorFallback errorId={this.state.errorId} retry={this.retry} />;
    }

    return this.props.children;
  }
}

interface FallbackProps {
  errorId?: string;
  retry: () => void;
}

const ChildFriendlyErrorFallback: React.FC<FallbackProps> = ({ errorId, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
      <div className="text-6xl mb-4">🤖</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Don't worry! Even the best learning robots sometimes need a little help. 
        Let's try again!
      </p>
      
      <button
        onClick={retry}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Try Again! 🚀
      </button>
      
      {process.env.NODE_ENV === 'development' && errorId && (
        <p className="text-xs text-gray-400 mt-4">
          Error ID: {errorId}
        </p>
      )}
    </div>
  );
};

// Specialized error boundaries for different parts of the app
export const PracticeErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const PracticeFallback: React.FC<FallbackProps> = ({ retry }) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200">
      <div className="text-6xl mb-4">📚</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Let's restart this practice session!
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Sometimes our practice questions need a moment to get ready. 
        No worries - your progress is saved!
      </p>
      <button
        onClick={retry}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Start Fresh! ✨
      </button>
    </div>
  );

  return (
    <ErrorBoundary fallback={PracticeFallback} level="critical">
      {children}
    </ErrorBoundary>
  );
};

export const DashboardErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const DashboardFallback: React.FC<FallbackProps> = ({ retry }) => (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
      <div className="text-6xl mb-4">🏠</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Let's refresh your dashboard!
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Your learning dashboard is taking a quick break. 
        Let's get it back up and running!
      </p>
      <button
        onClick={retry}
        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Refresh Dashboard! 🌟
      </button>
    </div>
  );

  return (
    <ErrorBoundary fallback={DashboardFallback} level="page">
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;