import { NextRequest, NextResponse } from 'next/server';
import { withAuth, checkSubscriptionLimits } from '@/lib/auth';
import { db } from '@/lib/database';
import type { DeckListResponse, DeckCreateRequest, DeckCreateResponse } from '@/types/database';

// GET /api/decks - List user's decks
export async function GET(request: NextRequest) {
  return withAuth(async (req, authContext) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const childId = searchParams.get('childId');

    // Get user's decks
    let decks = await db.getDecksByUser(authContext.user.id);

    // Filter by child if specified
    if (childId) {
      decks = decks.filter(deck => deck.child_id === childId);
    }

    // Get deck statistics for each deck
    const decksWithStats = await Promise.all(
      decks.map(async (deck) => {
        const questions = await db.getQuestionsByDeck(deck.id);
        const recentSessions = await db.getTestSessionsByChild(deck.child_id, 5);
        const deckSessions = recentSessions.filter(session => session.deck_id === deck.id);
        
        // Calculate categories
        const categories = questions.reduce((acc, question) => {
          const category = question.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category]++;
          return acc;
        }, {} as Record<string, number>);

        const lastSession = deckSessions[0];

        return {
          id: deck.id,
          name: deck.name,
          description: deck.description || '',
          totalQuestions: deck.total_questions,
          lastScore: lastSession?.score_percentage || undefined,
          lastTestDate: lastSession?.completed_at || undefined,
          processingStatus: deck.processing_status,
          categories: Object.entries(categories).map(([name, questionCount]) => ({
            name,
            questionCount
          }))
        };
      })
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDecks = decksWithStats.slice(startIndex, endIndex);

    const response: DeckListResponse = {
      decks: paginatedDecks,
      pagination: {
        page,
        limit,
        total: decksWithStats.length
      }
    };

    return response;
  })(request);
}

// POST /api/decks - Create new deck
export async function POST(request: NextRequest) {
  return withAuth(async (req, authContext) => {
    try {
      const formData = await req.formData();
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const childId = formData.get('childId') as string;
      const csvFile = formData.get('csvFile') as File;

      // Validate required fields
      if (!name || !childId || !csvFile) {
        return NextResponse.json(
          {
            error: {
              code: 'MISSING_FIELDS',
              message: 'Name, child ID, and CSV file are required',
              childFriendlyMessage: 'Please fill in all the required information and select a CSV file.'
            }
          },
          { status: 400 }
        );
      }

      // Check subscription limits
      const limitsCheck = await checkSubscriptionLimits(authContext, 'create_deck');
      if (!limitsCheck.allowed) {
        return NextResponse.json(
          {
            error: {
              code: 'SUBSCRIPTION_LIMIT',
              message: limitsCheck.reason,
              childFriendlyMessage: limitsCheck.reason
            }
          },
          { status: 403 }
        );
      }

      // Validate that the child belongs to the user
      const child = await db.getChildProfile(childId);
      if (!child || child.parent_id !== authContext.user.id) {
        return NextResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED_CHILD',
              message: 'Child does not belong to user',
              childFriendlyMessage: 'Please select one of your children.'
            }
          },
          { status: 403 }
        );
      }

      // Validate CSV file
      if (!csvFile.type.includes('csv') && !csvFile.name.endsWith('.csv')) {
        return NextResponse.json(
          {
            error: {
              code: 'INVALID_FILE_TYPE',
              message: 'Please upload a CSV file',
              childFriendlyMessage: 'Please upload a CSV file with your flashcards.'
            }
          },
          { status: 400 }
        );
      }

      // Check file size (max 10MB)
      if (csvFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: {
              code: 'FILE_TOO_LARGE',
              message: 'CSV file must be smaller than 10MB',
              childFriendlyMessage: 'Your file is too big! Please use a smaller CSV file.'
            }
          },
          { status: 400 }
        );
      }

      // Create deck record
      const deck = await db.createDeck({
        user_id: authContext.user.id,
        child_id: childId,
        name: name.trim(),
        description: description?.trim() || null,
        subject: 'Latin', // Default subject
        total_questions: 0,
        csv_filename: csvFile.name,
        processing_status: 'pending',
        is_active: true,
        ai_processing_metadata: {}
      });

      // TODO: Queue CSV processing job
      // For now, we'll just return the deck ID and a placeholder job ID
      const jobId = `job_${deck.id}_${Date.now()}`;

      const response: DeckCreateResponse = {
        deckId: deck.id,
        processingJobId: jobId,
        estimatedCompletionTime: 300 // 5 minutes estimate
      };

      return NextResponse.json(response, { status: 201 });

    } catch (error) {
      console.error('Error creating deck:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DECK_CREATION_FAILED',
            message: 'Failed to create deck',
            childFriendlyMessage: 'Something went wrong creating your deck. Please try again!'
          }
        },
        { status: 500 }
      );
    }
  })(request);
}