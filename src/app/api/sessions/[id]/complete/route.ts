import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import type { SessionCompleteResponse } from '@/types/database';

// POST /api/sessions/[id]/complete - Complete test session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req, authContext) => {
    try {
      const sessionId = params.id;

      // Get session details
      const { data: sessionData, error: sessionError } = await db.supabase
        .from('test_sessions')
        .select(`
          *,
          child_profiles!inner(parent_id),
          decks!inner(name, subject)
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        return NextResponse.json(
          {
            error: {
              code: 'SESSION_NOT_FOUND',
              message: 'Test session not found',
              childFriendlyMessage: 'We couldn\'t find your practice session!'
            }
          },
          { status: 404 }
        );
      }

      // Verify user has access to this session
      if (sessionData.child_profiles.parent_id !== authContext.user.id) {
        return NextResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED_SESSION',
              message: 'Not authorized to access this session'
            }
          },
          { status: 403 }
        );
      }

      // Check if session is already completed
      if (sessionData.completed_at) {
        return NextResponse.json(
          {
            error: {
              code: 'SESSION_ALREADY_COMPLETED',
              message: 'Session has already been completed',
              childFriendlyMessage: 'This practice session is already finished!'
            }
          },
          { status: 400 }
        );
      }

      // Get all responses for this session
      const responses = await db.getResponsesBySession(sessionId);

      // Calculate session statistics
      const totalQuestions = sessionData.total_questions;
      const correctAnswers = responses.filter(r => r.is_correct).length;
      const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // Calculate duration
      const startTime = new Date(sessionData.started_at);
      const endTime = new Date();
      const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      // Get category breakdown
      const categoryBreakdown = await calculateCategoryBreakdown(sessionData.deck_id, responses);

      // Generate achievements
      const achievements = generateAchievements(scorePercentage, correctAnswers, durationSeconds);

      // Update session with completion data
      await db.updateTestSession(sessionId, {
        completed_at: endTime.toISOString(),
        correct_answers: correctAnswers,
        duration_seconds: durationSeconds,
        score_percentage: Math.round(scorePercentage * 100) / 100
      });

      // Generate final encouragement message
      const encouragementMessage = generateFinalEncouragement(scorePercentage, correctAnswers, totalQuestions);

      const response: SessionCompleteResponse = {
        score: Math.round(scorePercentage * 100) / 100,
        correctAnswers,
        totalQuestions,
        durationSeconds,
        categoryBreakdown,
        achievements,
        encouragementMessage
      };

      return NextResponse.json(response);

    } catch (error) {
      console.error('Error completing session:', error);
      return NextResponse.json(
        {
          error: {
            code: 'SESSION_COMPLETE_FAILED',
            message: 'Failed to complete session',
            childFriendlyMessage: 'Something went wrong finishing your session. Please try again!'
          }
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * Calculate performance breakdown by category
 */
async function calculateCategoryBreakdown(deckId: string, responses: any[]) {
  const questions = await db.getQuestionsByDeck(deckId);
  const categoryStats = new Map<string, { correct: number; total: number }>();

  // Initialize categories
  questions.forEach(question => {
    const category = question.category || 'Uncategorized';
    if (!categoryStats.has(category)) {
      categoryStats.set(category, { correct: 0, total: 0 });
    }
  });

  // Count responses by category
  responses.forEach(response => {
    const question = questions.find(q => q.id === response.question_id);
    if (question) {
      const category = question.category || 'Uncategorized';
      const stats = categoryStats.get(category);
      if (stats) {
        stats.total++;
        if (response.is_correct) {
          stats.correct++;
        }
      }
    }
  });

  // Convert to array format
  return Array.from(categoryStats.entries()).map(([category, stats]) => ({
    category,
    correct: stats.correct,
    total: stats.total
  })).filter(item => item.total > 0); // Only include categories with questions
}

/**
 * Generate achievements based on performance
 */
function generateAchievements(scorePercentage: number, correctAnswers: number, durationSeconds: number): string[] {
  const achievements: string[] = [];

  // Score-based achievements
  if (scorePercentage === 100) {
    achievements.push("Perfect Score! 🏆");
  } else if (scorePercentage >= 90) {
    achievements.push("Excellent Performance! ⭐");
  } else if (scorePercentage >= 80) {
    achievements.push("Great Job! 🌟");
  } else if (scorePercentage >= 70) {
    achievements.push("Good Work! 👍");
  }

  // Speed achievements (less than 10 seconds per question on average)
  const questionsAnswered = correctAnswers;
  if (questionsAnswered > 0 && durationSeconds / questionsAnswered < 10) {
    achievements.push("Speed Demon! ⚡");
  }

  // Effort achievements
  if (correctAnswers >= 10) {
    achievements.push("Study Champion! 📚");
  } else if (correctAnswers >= 5) {
    achievements.push("Learning Star! ⭐");
  }

  // Participation achievement
  if (achievements.length === 0) {
    achievements.push("Great Effort! 🎯");
  }

  return achievements;
}

/**
 * Generate final encouragement message
 */
function generateFinalEncouragement(scorePercentage: number, correctAnswers: number, totalQuestions: number): string {
  if (scorePercentage === 100) {
    return `🎉 Wow! You got ALL ${totalQuestions} questions right! You're a superstar! Keep up the amazing work!`;
  } else if (scorePercentage >= 90) {
    return `🌟 Fantastic job! You got ${correctAnswers} out of ${totalQuestions} questions right! You're doing excellent!`;
  } else if (scorePercentage >= 80) {
    return `👏 Great work! You got ${correctAnswers} out of ${totalQuestions} questions right! You're really improving!`;
  } else if (scorePercentage >= 70) {
    return `💪 Good job! You got ${correctAnswers} out of ${totalQuestions} questions right! Keep practicing and you'll get even better!`;
  } else if (scorePercentage >= 50) {
    return `🌱 Nice effort! You got ${correctAnswers} out of ${totalQuestions} questions right! Every practice session helps you learn more!`;
  } else {
    return `🌈 Thank you for practicing! You got ${correctAnswers} out of ${totalQuestions} questions right! Remember, learning takes time and every try makes you stronger!`;
  }
}