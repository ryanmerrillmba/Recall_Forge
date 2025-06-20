import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import type { SessionStartRequest, SessionStartResponse } from '@/types/database';

// POST /api/sessions - Start new test session
export async function POST(request: NextRequest) {
  return withAuth(async (req, authContext) => {
    try {
      const sessionData: SessionStartRequest = await req.json();

      // Validate required fields
      if (!sessionData.deckId || !sessionData.childId) {
        return NextResponse.json(
          {
            error: {
              code: 'MISSING_FIELDS',
              message: 'Deck ID and child ID are required',
              childFriendlyMessage: 'Please select a deck and child to start practicing!'
            }
          },
          { status: 400 }
        );
      }

      // Verify deck ownership
      const deck = await db.getDeckById(sessionData.deckId);
      if (!deck || deck.user_id !== authContext.user.id) {
        return NextResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED_DECK',
              message: 'Deck not found or not accessible',
              childFriendlyMessage: 'We couldn\'t find that deck. Please try another one!'
            }
          },
          { status: 403 }
        );
      }

      // Verify child access
      const child = await db.getChildProfile(sessionData.childId);
      if (!child || child.parent_id !== authContext.user.id) {
        return NextResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED_CHILD',
              message: 'Child not found or not accessible',
              childFriendlyMessage: 'Please select one of your children.'
            }
          },
          { status: 403 }
        );
      }

      // Check if deck processing is complete
      if (deck.processing_status !== 'completed') {
        return NextResponse.json(
          {
            error: {
              code: 'DECK_NOT_READY',
              message: 'Deck is still being processed',
              childFriendlyMessage: 'Your deck is still being prepared! Please wait a few minutes and try again.'
            }
          },
          { status: 400 }
        );
      }

      // Get questions for the deck
      let questions = await db.getQuestionsByDeck(sessionData.deckId);

      if (questions.length === 0) {
        return NextResponse.json(
          {
            error: {
              code: 'NO_QUESTIONS',
              message: 'No questions found in deck',
              childFriendlyMessage: 'This deck doesn\'t have any questions yet. Please add some questions first!'
            }
          },
          { status: 400 }
        );
      }

      // Filter by categories if specified
      if (sessionData.categories && sessionData.categories.length > 0) {
        questions = questions.filter(q => 
          sessionData.categories!.includes(q.category || 'Uncategorized')
        );
      }

      // Limit number of questions if specified
      if (sessionData.questionCount && sessionData.questionCount > 0) {
        questions = shuffleArray(questions).slice(0, sessionData.questionCount);
      } else {
        // Default to shuffled subset for better variety
        questions = shuffleArray(questions).slice(0, Math.min(20, questions.length));
      }

      // Create test session
      const session = await db.createTestSession({
        child_id: sessionData.childId,
        deck_id: sessionData.deckId,
        total_questions: questions.length,
        correct_answers: 0,
        session_type: sessionData.sessionType || 'practice'
      });

      // Prepare questions for response (randomize answer order)
      const questionsForSession = questions.map(question => {
        const answers = [
          question.correct_answer,
          question.distractor_1,
          question.distractor_2,
          question.distractor_3
        ];

        return {
          id: question.id,
          questionText: question.question_text,
          options: shuffleArray(answers),
          category: question.category || 'Uncategorized',
          subcategory: question.subcategory || 'General'
        };
      });

      const response: SessionStartResponse = {
        sessionId: session.id,
        questions: questionsForSession,
        timeLimit: sessionData.sessionType === 'test' ? questions.length * 30 : undefined // 30 seconds per question for tests
      };

      return NextResponse.json(response, { status: 201 });

    } catch (error) {
      console.error('Error starting session:', error);
      return NextResponse.json(
        {
          error: {
            code: 'SESSION_START_FAILED',
            message: 'Failed to start session',
            childFriendlyMessage: 'Something went wrong starting your practice session. Please try again!'
          }
        },
        { status: 500 }
      );
    }
  })(request);
}

// GET /api/sessions - Get user's recent sessions
export async function GET(request: NextRequest) {
  return withAuth(async (req, authContext) => {
    const { searchParams } = new URL(req.url);
    const childId = searchParams.get('childId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!childId) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_CHILD_ID',
            message: 'Child ID is required'
          }
        },
        { status: 400 }
      );
    }

    // Verify child access
    const child = await db.getChildProfile(childId);
    if (!child || child.parent_id !== authContext.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED_CHILD',
            message: 'Child not found or not accessible'
          }
        },
        { status: 403 }
      );
    }

    const sessions = await db.getTestSessionsByChild(childId, limit);

    // Get deck names for each session
    const sessionsWithDeckNames = await Promise.all(
      sessions.map(async (session) => {
        const deck = await db.getDeckById(session.deck_id);
        return {
          ...session,
          deckName: deck?.name || 'Unknown Deck'
        };
      })
    );

    return NextResponse.json(sessionsWithDeckNames);
  })(request);
}

/**
 * Utility function to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}