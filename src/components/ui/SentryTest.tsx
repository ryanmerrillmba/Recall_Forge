'use client';

import { reportChildSafeError, getChildFriendlyErrorMessage } from '@/lib/error-reporting';
import { useState } from 'react';

export default function SentryTest() {
  const [errorReported, setErrorReported] = useState<string | null>(null);

  const testError = () => {
    try {
      // Simulate an error that might happen in the app
      throw new Error('Test error for Sentry integration - child-123 session failed');
    } catch (error) {
      const errorId = reportChildSafeError(error as Error, {
        component: 'SentryTest',
        action: 'test_error_reporting',
        errorLevel: 'medium',
        userRole: 'parent', // Always parent/teacher, never child for COPPA
      });
      
      setErrorReported(errorId);
    }
  };

  const testBoundaryError = () => {
    // This will trigger the error boundary
    throw new Error('Boundary test error');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 Sentry Integration Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={testError}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test Child-Safe Error Reporting
        </button>
        
        <button
          onClick={testBoundaryError}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Test Error Boundary
        </button>
        
        {errorReported && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Error reported to Sentry!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Error ID: {errorReported}
            </p>
            <p className="text-sm text-green-700 mt-2">
              Child-friendly message: {getChildFriendlyErrorMessage('generic')}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>COPPA Compliance:</strong> All errors are sanitized to remove child identifiers before being sent to Sentry.
        </p>
      </div>
    </div>
  );
}