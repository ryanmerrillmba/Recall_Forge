import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import type { DeckDetailResponse } from '@/types/database';

// GET /api/decks/[id] - Get deck details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req, authContext) => {
    const resolvedParams = await params;
    const deckId = resolvedParams.id;

    // Get deck details
    const deck = await db.getDeckById(deckId);
    
    if (!deck) {
      return NextResponse.json(
        {
          error: {
            code: 'DECK_NOT_FOUND',
            message: 'Deck not found',
            childFriendlyMessage: 'We couldn\'t find that deck. Please check and try again.'
          }
        },
        { status: 404 }
      );
    }

    // Verify user owns this deck
    if (deck.user_id !== authContext.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authorized to access this deck',
            childFriendlyMessage: 'You don\'t have permission to view this deck.'
          }
        },
        { status: 403 }
      );
    }

    // Get questions for the deck
    const questions = await db.getQuestionsByDeck(deckId);
    
    // Get recent test sessions
    const recentSessions = await db.getTestSessionsByChild(deck.child_id, 10);
    const deckSessions = recentSessions.filter(session => session.deck_id === deckId);

    // Calculate categories and subcategories
    const categoryMap = new Map<string, {
      name: string;
      subcategories: Map<string, { name: string; questionCount: number; averageScore: number; }>;
    }>();

    questions.forEach(question => {
      const category = question.category || 'Uncategorized';
      const subcategory = question.subcategory || 'General';

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          subcategories: new Map()
        });
      }

      const categoryData = categoryMap.get(category)!;
      
      if (!categoryData.subcategories.has(subcategory)) {
        categoryData.subcategories.set(subcategory, {
          name: subcategory,
          questionCount: 0,
          averageScore: 0
        });
      }

      const subcategoryData = categoryData.subcategories.get(subcategory)!;
      subcategoryData.questionCount++;
    });

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(deckSessions, questions);

    // Convert categories map to array format
    const categories = Array.from(categoryMap.entries()).map(([categoryName, categoryData]) => ({
      name: categoryName,
      subcategories: Array.from(categoryData.subcategories.values())
    }));

    const response: DeckDetailResponse = {
      id: deck.id,
      name: deck.name,
      description: deck.description || '',
      totalQuestions: deck.total_questions,
      categories,
      recentSessions: deckSessions.slice(0, 5), // Latest 5 sessions
      performanceMetrics
    };

    return NextResponse.json(response);
  })(request);
}

// PUT /api/decks/[id] - Update deck
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req, authContext) => {
    const resolvedParams = await params;
    const deckId = resolvedParams.id;
    const updates = await req.json();

    // Get existing deck
    const deck = await db.getDeckById(deckId);
    
    if (!deck) {
      return NextResponse.json(
        {
          error: {
            code: 'DECK_NOT_FOUND',
            message: 'Deck not found'
          }
        },
        { status: 404 }
      );
    }

    // Verify user owns this deck
    if (deck.user_id !== authContext.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authorized to update this deck'
          }
        },
        { status: 403 }
      );
    }

    // Validate and sanitize updates
    const allowedUpdates = ['name', 'description', 'subject'];
    const sanitizedUpdates: any = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key) && value !== undefined) {
        if (key === 'name' && typeof value === 'string') {
          sanitizedUpdates[key] = value.trim();
        } else if (key === 'description' && (typeof value === 'string' || value === null)) {
          sanitizedUpdates[key] = value?.trim() || null;
        } else if (key === 'subject' && typeof value === 'string') {
          sanitizedUpdates[key] = value.trim();
        }
      }
    }

    // Update the deck
    const updatedDeck = await db.updateDeck(deckId, sanitizedUpdates);

    return NextResponse.json(updatedDeck);
  })(request);
}

// DELETE /api/decks/[id] - Delete deck
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req, authContext) => {
    const resolvedParams = await params;
    const deckId = resolvedParams.id;

    // Get existing deck
    const deck = await db.getDeckById(deckId);
    
    if (!deck) {
      return NextResponse.json(
        {
          error: {
            code: 'DECK_NOT_FOUND',
            message: 'Deck not found'
          }
        },
        { status: 404 }
      );
    }

    // Verify user owns this deck
    if (deck.user_id !== authContext.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authorized to delete this deck'
          }
        },
        { status: 403 }
      );
    }

    // Soft delete (mark as inactive)
    await db.updateDeck(deckId, { is_active: false });

    return NextResponse.json({ success: true });
  })(request);
}

/**
 * Calculate performance metrics for a deck
 */
function calculatePerformanceMetrics(sessions: any[], questions: any[]) {
  if (sessions.length === 0) {
    return {
      averageScore: 0,
      improvementTrend: 0,
      timeSpentMinutes: 0,
      strongestCategories: [],
      weakestCategories: []
    };
  }

  // Calculate average score
  const averageScore = sessions.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / sessions.length;

  // Calculate improvement trend (last 3 vs first 3 sessions)
  let improvementTrend = 0;
  if (sessions.length >= 6) {
    const recentSessions = sessions.slice(0, 3);
    const oldSessions = sessions.slice(-3);
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + (s.score_percentage || 0), 0) / 3;
    const oldAvg = oldSessions.reduce((sum, s) => sum + (s.score_percentage || 0), 0) / 3;
    
    improvementTrend = recentAvg - oldAvg;
  }

  // Calculate total time spent
  const timeSpentMinutes = sessions.reduce((sum, session) => {
    return sum + (session.duration_seconds || 0);
  }, 0) / 60;

  // Calculate category performance (simplified for now)
  const categoryPerformance = new Map<string, number>();
  
  // This would require more complex analysis of question responses
  // For now, return sample data
  const strongestCategories = ['Vocabulary', 'Grammar'];
  const weakestCategories = ['Pronunciation', 'Conjugations'];

  return {
    averageScore: Math.round(averageScore * 100) / 100,
    improvementTrend: Math.round(improvementTrend * 100) / 100,
    timeSpentMinutes: Math.round(timeSpentMinutes),
    strongestCategories,
    weakestCategories
  };
}