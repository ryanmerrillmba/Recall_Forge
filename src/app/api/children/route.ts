import { NextRequest, NextResponse } from 'next/server';
import { withAuth, createChildWithCOPPACheck } from '@/lib/auth';
import { db } from '@/lib/database';

// GET /api/children - Get user's children
export async function GET(request: NextRequest) {
  return withAuth(async (req, authContext) => {
    const children = await db.getChildrenByParent(authContext.user.id);
    
    // Add basic statistics for each child
    const childrenWithStats = await Promise.all(
      children.map(async (child) => {
        const decks = await db.getDecksByUser(authContext.user.id);
        const childDecks = decks.filter(deck => deck.child_id === child.id);
        const recentSessions = await db.getTestSessionsByChild(child.id, 10);
        
        const averageScore = recentSessions.length > 0
          ? recentSessions.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / recentSessions.length
          : 0;

        return {
          ...child,
          statistics: {
            totalDecks: childDecks.length,
            totalSessions: recentSessions.length,
            averageScore: Math.round(averageScore * 100) / 100,
            lastSessionDate: recentSessions[0]?.completed_at || null
          }
        };
      })
    );

    return NextResponse.json(childrenWithStats);
  })(request);
}

// POST /api/children - Create new child profile
export async function POST(request: NextRequest) {
  return withAuth(async (req, authContext) => {
    try {
      const childData = await req.json();

      // Validate required fields
      if (!childData.name || typeof childData.name !== 'string') {
        return NextResponse.json(
          {
            error: {
              code: 'INVALID_NAME',
              message: 'Child name is required',
              childFriendlyMessage: 'Please enter your child\'s name.'
            }
          },
          { status: 400 }
        );
      }

      // Validate grade level if provided
      if (childData.grade_level !== undefined) {
        const grade = parseInt(childData.grade_level);
        if (isNaN(grade) || grade < 1 || grade > 12) {
          return NextResponse.json(
            {
              error: {
                code: 'INVALID_GRADE',
                message: 'Grade level must be between 1 and 12',
                childFriendlyMessage: 'Please select a grade level between 1st and 12th grade.'
              }
            },
            { status: 400 }
          );
        }
        childData.grade_level = grade;
      }

      // Validate birth year if provided
      if (childData.birth_year !== undefined) {
        const birthYear = parseInt(childData.birth_year);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(birthYear) || birthYear < 2000 || birthYear > currentYear) {
          return NextResponse.json(
            {
              error: {
                code: 'INVALID_BIRTH_YEAR',
                message: 'Invalid birth year',
                childFriendlyMessage: 'Please enter a valid birth year.'
              }
            },
            { status: 400 }
          );
        }
        childData.birth_year = birthYear;
      }

      // Create child with COPPA compliance checks
      const child = await createChildWithCOPPACheck(authContext, {
        name: childData.name.trim(),
        grade_level: childData.grade_level || null,
        birth_year: childData.birth_year || null,
        is_active: true,
        preferences: childData.preferences || {}
      });

      return NextResponse.json(child, { status: 201 });

    } catch (error: any) {
      console.error('Error creating child:', error);
      
      if (error.code) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              childFriendlyMessage: error.childFriendlyMessage || error.message
            }
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: {
            code: 'CHILD_CREATION_FAILED',
            message: 'Failed to create child profile',
            childFriendlyMessage: 'Something went wrong creating the child profile. Please try again!'
          }
        },
        { status: 500 }
      );
    }
  })(request);
}