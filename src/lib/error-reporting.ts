// Temporary mock for Sentry until re-integration
const Sentry = {
  captureException: (error: Error, options?: any) => {
    console.error('Error captured:', error);
    return 'mock-error-id';
  },
  addBreadcrumb: (breadcrumb: any) => {
    console.log('Breadcrumb:', breadcrumb);
  },
};

// COPPA-compliant error reporting utilities
export interface ChildSafeErrorContext {
  action?: string;
  component?: string;
  userRole?: 'parent' | 'teacher' | 'admin'; // Never 'child'
  sessionType?: 'practice' | 'test' | 'review';
  deckSubject?: string;
  errorLevel?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Report errors in a child-safe manner that complies with COPPA
 */
export const reportChildSafeError = (
  error: Error | string,
  context: ChildSafeErrorContext = {}
): string => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Sanitize error message to remove any potential child identifiers
  const sanitizedMessage = sanitizeErrorMessage(errorMessage);
  
  // Create child-safe context
  const safeContext = {
    ...context,
    timestamp: new Date().toISOString(),
    platform: 'recallforge',
    childDataPresent: false, // Always false for COPPA compliance
  };
  
  // Remove any potentially identifying information
  delete (safeContext as any).childId;
  delete (safeContext as any).studentId;
  delete (safeContext as any).childName;
  
  const eventId = Sentry.captureException(
    typeof error === 'string' ? new Error(sanitizedMessage) : error,
    {
      tags: {
        childSafe: true,
        errorLevel: context.errorLevel || 'medium',
        component: context.component || 'unknown',
        action: context.action || 'unknown',
      },
      extra: safeContext,
      level: mapErrorLevel(context.errorLevel || 'medium'),
    }
  );
  
  return eventId;
};

/**
 * Sanitize error messages to remove potential child identifiers
 */
export const sanitizeErrorMessage = (message: string): string => {
  return message
    // Remove potential child IDs
    .replace(/child-\w+/gi, 'child-[ID]')
    .replace(/student-\w+/gi, 'student-[ID]')
    .replace(/kid-\w+/gi, 'kid-[ID]')
    // Remove long number sequences that might be IDs
    .replace(/\b\d{6,}\b/g, '[ID]')
    // Remove email addresses that might identify children
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    // Remove potential names (common first names)
    .replace(/\b(alex|sam|jordan|taylor|casey|riley|avery|charlie|drew|jamie|morgan|quinn|sage|skylar|cameron|devon|dallas|river|phoenix|rowan|sage)\b/gi, '[NAME]')
    // Keep the error meaningful but safe
    .trim();
};

/**
 * Map error levels to Sentry severity levels
 */
const mapErrorLevel = (level: string): string => {
  switch (level) {
    case 'low': return 'info';
    case 'medium': return 'warning';
    case 'high': return 'error';
    case 'critical': return 'fatal';
    default: return 'warning';
  }
};

/**
 * Report performance issues that might affect child learning experience
 */
export const reportPerformanceIssue = (
  metric: string,
  value: number,
  threshold: number,
  context: ChildSafeErrorContext = {}
): void => {
  if (value > threshold) {
    Sentry.addBreadcrumb({
      message: `Performance issue: ${metric}`,
      level: 'warning',
      data: {
        metric,
        value,
        threshold,
        exceeded: value - threshold,
        ...context,
      },
    });
    
    // For critical performance issues (like slow loading that affects child attention)
    if (value > threshold * 2) {
      reportChildSafeError(
        `Performance issue: ${metric} (${value}ms) exceeded threshold (${threshold}ms)`,
        {
          ...context,
          errorLevel: 'high',
          action: 'performance_monitoring',
        }
      );
    }
  }
};

/**
 * Child-friendly error messages for different scenarios
 */
export const getChildFriendlyErrorMessage = (errorType: string): string => {
  const messages = {
    network: "Looks like we're having trouble connecting. Let's try again in a moment! 🌐",
    loading: "Our learning robot is working extra hard to get your questions ready! 🤖",
    save: "Don't worry! We're making sure your progress is safe and sound. 💾",
    upload: "Let's try uploading your flashcards again. Sometimes files need a second try! 📁",
    ai: "Our question-making helper is taking a quick break. Let's try again! 🧠",
    payment: "Having trouble with billing? No worries - learning never stops! 💳",
    auth: "Let's help you log in safely. Your learning adventure awaits! 🔐",
    generic: "Oops! Something unexpected happened. Let's give it another try! ✨",
  };
  
  return messages[errorType as keyof typeof messages] || messages.generic;
};

/**
 * Log child-safe analytics events
 */
export const logChildSafeEvent = (
  eventName: string,
  properties: Record<string, any> = {}
): void => {
  // Remove any potential child identifiers from properties
  const safeProperties = Object.keys(properties).reduce((acc, key) => {
    if (!key.toLowerCase().includes('child') && 
        !key.toLowerCase().includes('student') && 
        !key.toLowerCase().includes('kid')) {
      acc[key] = properties[key];
    }
    return acc;
  }, {} as Record<string, any>);
  
  Sentry.addBreadcrumb({
    message: eventName,
    level: 'info',
    data: {
      ...safeProperties,
      timestamp: new Date().toISOString(),
      childSafe: true,
    },
  });
};

/**
 * Create a child-safe error context for components
 */
export const createErrorContext = (
  component: string,
  action?: string,
  additionalContext?: Partial<ChildSafeErrorContext>
): ChildSafeErrorContext => {
  return {
    component,
    action,
    errorLevel: 'medium',
    ...additionalContext,
  };
};