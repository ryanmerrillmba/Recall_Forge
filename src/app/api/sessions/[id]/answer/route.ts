import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import type { AnswerSubmitRequest, AnswerSubmitResponse } from '@/types/database';

// POST /api/sessions/[id]/answer - Submit answer for a question
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req, authContext) => {
    try {
      const sessionId = params.id;
      const answerData: AnswerSubmitRequest = await req.json();

      // Validate required fields
      if (!answerData.questionId || !answerData.selectedAnswer) {
        return NextResponse.json(
          {
            error: {
              code: 'MISSING_FIELDS',
              message: 'Question ID and selected answer are required',
              childFriendlyMessage: 'Please select an answer before submitting!'
            }
          },
          { status: 400 }
        );
      }

      // Get and verify session
      const { data: sessionData, error: sessionError } = await db.supabase
        .from('test_sessions')
        .select(`
          *,
          child_profiles!inner(parent_id)
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        return NextResponse.json(
          {
            error: {
              code: 'SESSION_NOT_FOUND',
              message: 'Test session not found',
              childFriendlyMessage: 'We couldn\'t find your practice session. Please start a new one!'
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
              message: 'Not authorized to access this session',
              childFriendlyMessage: 'You don\'t have permission to access this session.'
            }
          },
          { status: 403 }
        );
      }

      // Check if session is still active
      if (sessionData.completed_at) {
        return NextResponse.json(
          {
            error: {
              code: 'SESSION_COMPLETED',
              message: 'Session has already been completed',
              childFriendlyMessage: 'This practice session is already finished!'
            }
          },
          { status: 400 }
        );
      }

      // Get question details
      const question = await db.getQuestionsByDeck(sessionData.deck_id);
      const currentQuestion = question.find(q => q.id === answerData.questionId);

      if (!currentQuestion) {
        return NextResponse.json(
          {
            error: {
              code: 'QUESTION_NOT_FOUND',
              message: 'Question not found',
              childFriendlyMessage: 'We couldn\'t find that question. Please try again!'
            }
          },
          { status: 404 }
        );
      }

      // Check if answer was already submitted for this question
      const existingResponse = await db.getResponsesBySession(sessionId);
      const alreadyAnswered = existingResponse.some(r => r.question_id === answerData.questionId);

      if (alreadyAnswered) {
        return NextResponse.json(
          {
            error: {
              code: 'ALREADY_ANSWERED',
              message: 'Question has already been answered',
              childFriendlyMessage: 'You\'ve already answered this question!'
            }
          },
          { status: 400 }
        );
      }

      // Check if answer is correct
      const isCorrect = answerData.selectedAnswer.trim().toLowerCase() === 
                       currentQuestion.correct_answer.trim().toLowerCase();

      // Record the answer
      await db.createQuestionResponse({
        session_id: sessionId,
        question_id: answerData.questionId,
        selected_answer: answerData.selectedAnswer,
        is_correct: isCorrect,
        response_time_seconds: answerData.responseTimeSeconds || null
      });

      // Update session with new correct answer count
      if (isCorrect) {
        const { data: updatedSession } = await db.supabase
          .from('test_sessions')
          .update({
            correct_answers: sessionData.correct_answers + 1
          })
          .eq('id', sessionId)
          .select()
          .single();
      }

      // Generate encouraging message
      const encouragementMessage = generateEncouragementMessage(isCorrect, sessionData.correct_answers);

      const response: AnswerSubmitResponse = {
        isCorrect,
        correctAnswer: isCorrect ? undefined : currentQuestion.correct_answer,
        explanation: isCorrect ? undefined : generateExplanation(currentQuestion),
        encouragementMessage
      };

      return NextResponse.json(response);

    } catch (error) {
      console.error('Error submitting answer:', error);
      return NextResponse.json(
        {
          error: {
            code: 'ANSWER_SUBMIT_FAILED',
            message: 'Failed to submit answer',
            childFriendlyMessage: 'Something went wrong submitting your answer. Please try again!'
          }
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * Generate encouraging messages for children
 */
function generateEncouragementMessage(isCorrect: boolean, correctAnswers: number): string {
  if (isCorrect) {
    const correctMessages = [
      "Great job! 🌟",
      "Excellent work! ✨",
      "You got it right! 🎉",
      "Fantastic! Keep it up! 🚀",
      "Well done! 👏",
      "Perfect! You're doing amazing! ⭐",
      "Outstanding! 🎊",
      "Brilliant answer! 💫"
    ];
    
    // Add milestone messages
    if (correctAnswers > 0 && correctAnswers % 5 === 0) {
      return `Amazing! You've gotten ${correctAnswers} questions right! 🏆`;
    }
    
    return correctMessages[Math.floor(Math.random() * correctMessages.length)];
  } else {
    const encouragingMessages = [
      "That's okay! Learning is about trying! 🌱",
      "Don't worry! You'll get the next one! 💪",
      "Good effort! Keep practicing! 🌟",
      "That's alright! Every mistake helps you learn! 📚",
      "Nice try! You're getting better! 🎯",
      "Don't give up! You're doing great! 🌈",
      "That's okay! Learning takes time! ⏰",
      "Good attempt! Keep going! 🚀"
    ];
    
    return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
  }
}

/**
 * Generate simple explanations for incorrect answers
 */
function generateExplanation(question: any): string {
  // This is a simplified explanation generator
  // In a real implementation, this could be powered by AI or pre-written explanations
  return `The correct answer is "${question.correct_answer}". ${
    question.category ? `This is a ${question.category} question.` : ''
  } Keep practicing to remember it better!`;
}