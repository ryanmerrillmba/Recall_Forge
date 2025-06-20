import { createServerSupabase } from './supabase-server';
import { createClientSupabase, COPPA_CONFIG } from './supabase';
import { db } from './database';
import type { User, ChildProfile } from '@/types/database';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthContext {
  user: User;
  children?: ChildProfile[];
  role: 'parent' | 'teacher' | 'admin';
  permissions: string[];
  subscription: {
    status: 'free' | 'individual' | 'family' | 'educator';
    isActive: boolean;
    expiresAt?: Date;
  };
}

export interface AuthError {
  code: string;
  message: string;
  childFriendlyMessage?: string;
  recoveryActions?: string[];
}

/**
 * COPPA-compliant authentication middleware
 * Ensures only adults (parents/teachers) can authenticate
 */
export async function authMiddleware(request: NextRequest): Promise<AuthContext> {
  const supabase = createServerSupabase();
  
  try {
    // Get the user from the session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new AuthError('NO_USER', 'No authenticated user found');
    }

    // Get user profile from our database
    const userProfile = await db.getUserById(user.id);
    
    if (!userProfile) {
      throw new AuthError('USER_NOT_FOUND', 'User profile not found in database');
    }

    // COPPA compliance check - no child users allowed
    if (!COPPA_CONFIG.ALLOWED_ROLES.includes(userProfile.role)) {
      throw new AuthError(
        'COPPA_VIOLATION', 
        'Direct child authentication not allowed',
        'Only parents and teachers can log in. Children use the app through their parent or teacher account.'
      );
    }

    // Check if account is active
    if (!userProfile.is_active) {
      throw new AuthError(
        'ACCOUNT_INACTIVE', 
        'User account is inactive',
        'Your account has been deactivated. Please contact support for help.'
      );
    }

    // Get user's children (if parent)
    let children: ChildProfile[] = [];
    if (userProfile.role === 'parent') {
      children = await db.getChildrenByParent(userProfile.id);
    }

    // Get user permissions based on role
    const permissions = getUserPermissions(userProfile.role, userProfile.subscription_status);

    // Check subscription status
    const subscription = {
      status: userProfile.subscription_status,
      isActive: isSubscriptionActive(userProfile),
      expiresAt: userProfile.subscription_expires_at ? new Date(userProfile.subscription_expires_at) : undefined
    };

    // Update last login timestamp
    await db.updateUser(userProfile.id, {
      last_login: new Date().toISOString()
    });

    return {
      user: userProfile,
      children,
      role: userProfile.role,
      permissions,
      subscription
    };

  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    
    throw new AuthError(
      'AUTH_ERROR', 
      'Authentication failed',
      'There was a problem signing you in. Please try again.'
    );
  }
}

/**
 * Get user permissions based on role and subscription
 */
function getUserPermissions(role: string, subscriptionStatus: string): string[] {
  const basePermissions = ['read_own_data'];
  
  switch (role) {
    case 'admin':
      return [
        ...basePermissions,
        'read_all_data',
        'write_all_data',
        'manage_users',
        'view_analytics',
        'manage_subscriptions'
      ];
      
    case 'teacher':
      return [
        ...basePermissions,
        'create_decks',
        'manage_students',
        'view_student_progress',
        'bulk_operations',
        subscriptionStatus === 'educator' ? 'advanced_analytics' : null
      ].filter(Boolean) as string[];
      
    case 'parent':
      return [
        ...basePermissions,
        'create_children',
        'manage_children',
        'create_decks',
        'view_child_progress',
        subscriptionStatus === 'family' ? 'advanced_analytics' : null,
        subscriptionStatus !== 'free' ? 'unlimited_decks' : null
      ].filter(Boolean) as string[];
      
    default:
      return basePermissions;
  }
}

/**
 * Check if user's subscription is active
 */
function isSubscriptionActive(user: User): boolean {
  if (user.subscription_status === 'free') {
    return true; // Free tier is always "active"
  }
  
  if (!user.subscription_expires_at) {
    return false;
  }
  
  return new Date(user.subscription_expires_at) > new Date();
}

/**
 * Check if user has specific permission
 */
export function hasPermission(authContext: AuthContext, permission: string): boolean {
  return authContext.permissions.includes(permission);
}

/**
 * Check subscription limits for various operations
 */
export async function checkSubscriptionLimits(
  authContext: AuthContext, 
  action: 'create_deck' | 'add_child' | 'advanced_features'
): Promise<{ allowed: boolean; reason?: string }> {
  
  const { user, subscription } = authContext;
  
  // Free tier limits
  if (subscription.status === 'free') {
    switch (action) {
      case 'create_deck':
        const deckCount = (await db.getDecksByUser(user.id)).length;
        if (deckCount >= 5) {
          return { 
            allowed: false, 
            reason: 'Free accounts are limited to 5 decks. Upgrade to create more!' 
          };
        }
        break;
        
      case 'add_child':
        const childCount = (await db.getChildrenByParent(user.id)).length;
        if (childCount >= 1) {
          return { 
            allowed: false, 
            reason: 'Free accounts support 1 child. Upgrade to add more children!' 
          };
        }
        break;
        
      case 'advanced_features':
        return { 
          allowed: false, 
          reason: 'Advanced features require a paid subscription.' 
        };
    }
  }
  
  // Individual plan limits
  if (subscription.status === 'individual') {
    switch (action) {
      case 'add_child':
        const childCount = (await db.getChildrenByParent(user.id)).length;
        if (childCount >= 1) {
          return { 
            allowed: false, 
            reason: 'Individual plan supports 1 child. Upgrade to Family plan for more!' 
          };
        }
        break;
    }
  }
  
  // Family plan limits
  if (subscription.status === 'family') {
    switch (action) {
      case 'add_child':
        const childCount = (await db.getChildrenByParent(user.id)).length;
        if (childCount >= 5) {
          return { 
            allowed: false, 
            reason: 'Family plan supports up to 5 children.' 
          };
        }
        break;
    }
  }
  
  // Educator plan limits
  if (subscription.status === 'educator') {
    switch (action) {
      case 'add_child':
        const studentCount = (await db.getChildrenByParent(user.id)).length;
        if (studentCount >= 30) {
          return { 
            allowed: false, 
            reason: 'Educator plan supports up to 30 students per class.' 
          };
        }
        break;
    }
  }
  
  return { allowed: true };
}

/**
 * Create a new child profile with COPPA compliance checks
 */
export async function createChildWithCOPPACheck(
  authContext: AuthContext,
  childData: Omit<ChildProfile, 'id' | 'parent_id' | 'created_at'>
): Promise<ChildProfile> {
  
  // Check if user can add more children
  const limitsCheck = await checkSubscriptionLimits(authContext, 'add_child');
  if (!limitsCheck.allowed) {
    throw new AuthError('SUBSCRIPTION_LIMIT', limitsCheck.reason!);
  }
  
  // Age validation for COPPA compliance
  if (childData.birth_year) {
    const age = new Date().getFullYear() - childData.birth_year;
    
    if (age < 5 || age > 18) {
      throw new AuthError(
        'INVALID_AGE',
        'Child age must be between 5 and 18 years',
        'Please check the birth year. RecallForge is designed for children ages 5-18.'
      );
    }
    
    // Special handling for children under 13 (enhanced COPPA protections)
    if (age < COPPA_CONFIG.MIN_AGE) {
      console.log(`Creating child profile with enhanced COPPA protections for age ${age}`);
    }
  }
  
  // Validate name length and content
  if (!childData.name || childData.name.trim().length < 1) {
    throw new AuthError(
      'INVALID_NAME',
      'Child name is required',
      'Please enter your child\'s name.'
    );
  }
  
  // Create the child profile
  const child = await db.createChildProfile({
    ...childData,
    parent_id: authContext.user.id
  });
  
  return child;
}

/**
 * Sign out user and clear all sessions
 */
export async function signOut(): Promise<void> {
  const supabase = createClientSupabase();
  await supabase.auth.signOut();
}

/**
 * Refresh user session and context
 */
export async function refreshAuthContext(): Promise<AuthContext | null> {
  try {
    const request = new NextRequest('http://localhost:3000');
    return await authMiddleware(request);
  } catch (error) {
    return null;
  }
}

/**
 * Custom AuthError class for better error handling
 */
class AuthError extends Error {
  code: string;
  childFriendlyMessage?: string;
  recoveryActions?: string[];

  constructor(
    code: string, 
    message: string, 
    childFriendlyMessage?: string, 
    recoveryActions?: string[]
  ) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.childFriendlyMessage = childFriendlyMessage;
    this.recoveryActions = recoveryActions;
  }
}

/**
 * Middleware wrapper for Next.js API routes
 */
export function withAuth<T = any>(
  handler: (req: NextRequest, context: AuthContext) => Promise<T>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authContext = await authMiddleware(req);
      const result = await handler(req, authContext);
      
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              childFriendlyMessage: error.childFriendlyMessage,
              recoveryActions: error.recoveryActions
            }
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
            childFriendlyMessage: 'Something went wrong. Please try again!'
          }
        },
        { status: 500 }
      );
    }
  };
}

export { AuthError };