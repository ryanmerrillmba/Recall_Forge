import { createClientSupabase } from './supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface ProgressUpdate {
  type: 'job_progress' | 'session_update' | 'encouragement';
  jobId?: string;
  sessionId?: string;
  childId?: string;
  status?: string;
  progress?: number;
  message: string;
  timestamp: string;
}

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

export class RealtimeManager {
  private supabase;
  private subscriptions: Map<string, RealtimeChannel> = new Map();

  constructor() {
    this.supabase = createClientSupabase();
  }

  /**
   * Subscribe to deck processing updates
   */
  subscribeToJobProgress(
    jobId: string, 
    callback: (update: ProgressUpdate) => void
  ): RealtimeSubscription {
    const channelName = `job-progress-${jobId}`;
    
    const channel = this.supabase
      .channel(channelName)
      .on('broadcast', { event: 'progress' }, (payload) => {
        callback(payload.payload as ProgressUpdate);
      })
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  /**
   * Subscribe to test session updates
   */
  subscribeToSessionUpdates(
    sessionId: string,
    callback: (update: ProgressUpdate) => void
  ): RealtimeSubscription {
    const channelName = `session-${sessionId}`;

    const channel = this.supabase
      .channel(channelName)
      .on('broadcast', { event: 'session_update' }, (payload) => {
        callback(payload.payload as ProgressUpdate);
      })
      .subscribe();

    this.subscriptions.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  /**
   * Subscribe to database changes for a specific table
   */
  subscribeToTableChanges(
    table: string,
    filter?: string,
    callback?: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeSubscription {
    const channelName = `table-${table}-${Date.now()}`;

    let channelBuilder = this.supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter 
        }, 
        callback || (() => {})
      );

    const channel = channelBuilder.subscribe();
    this.subscriptions.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  /**
   * Subscribe to deck processing status changes
   */
  subscribeToDeckProcessing(
    deckId: string,
    callback: (status: 'pending' | 'processing' | 'completed' | 'failed', progress?: number) => void
  ): RealtimeSubscription {
    return this.subscribeToTableChanges(
      'decks',
      `id=eq.${deckId}`,
      (payload) => {
        if (payload.new && 'processing_status' in payload.new) {
          const metadata = payload.new.ai_processing_metadata as any;
          callback(
            payload.new.processing_status as any,
            metadata?.progress || 0
          );
        }
      }
    );
  }

  /**
   * Subscribe to test session completion
   */
  subscribeToSessionCompletion(
    sessionId: string,
    callback: (session: any) => void
  ): RealtimeSubscription {
    return this.subscribeToTableChanges(
      'test_sessions',
      `id=eq.${sessionId}`,
      (payload) => {
        if (payload.new && payload.new.completed_at) {
          callback(payload.new);
        }
      }
    );
  }

  /**
   * Broadcast job progress update
   */
  async broadcastJobProgress(
    jobId: string, 
    status: string, 
    progress: number, 
    message: string
  ): Promise<void> {
    const channelName = `job-progress-${jobId}`;
    const channel = this.supabase.channel(channelName);

    await channel.send({
      type: 'broadcast',
      event: 'progress',
      payload: {
        type: 'job_progress',
        jobId,
        status,
        progress,
        message,
        timestamp: new Date().toISOString()
      } as ProgressUpdate
    });
  }

  /**
   * Broadcast session update
   */
  async broadcastSessionUpdate(
    sessionId: string,
    message: string,
    data?: any
  ): Promise<void> {
    const channelName = `session-${sessionId}`;
    const channel = this.supabase.channel(channelName);

    await channel.send({
      type: 'broadcast',
      event: 'session_update',
      payload: {
        type: 'session_update',
        sessionId,
        message,
        timestamp: new Date().toISOString(),
        ...data
      } as ProgressUpdate
    });
  }

  /**
   * Send child encouragement message
   */
  async sendChildEncouragement(
    childId: string,
    message: string
  ): Promise<void> {
    const channelName = `child-${childId}`;
    const channel = this.supabase.channel(channelName);

    await channel.send({
      type: 'broadcast',
      event: 'encouragement',
      payload: {
        type: 'encouragement',
        childId,
        message,
        timestamp: new Date().toISOString()
      } as ProgressUpdate
    });
  }

  /**
   * Unsubscribe from a specific channel
   */
  private unsubscribe(channelName: string): void {
    const channel = this.subscriptions.get(channelName);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.subscriptions.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    for (const [channelName, channel] of this.subscriptions) {
      this.supabase.removeChannel(channel);
    }
    this.subscriptions.clear();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    // This would need to be implemented based on Supabase's realtime status
    return 'connected'; // Simplified for now
  }
}

// Export singleton instance
export const realtime = new RealtimeManager();

// Utility functions for common realtime operations
export const subscribeToJobProgress = (jobId: string, callback: (update: ProgressUpdate) => void) =>
  realtime.subscribeToJobProgress(jobId, callback);

export const subscribeToSessionUpdates = (sessionId: string, callback: (update: ProgressUpdate) => void) =>
  realtime.subscribeToSessionUpdates(sessionId, callback);

export const broadcastJobProgress = (jobId: string, status: string, progress: number, message: string) =>
  realtime.broadcastJobProgress(jobId, status, progress, message);

export const sendChildEncouragement = (childId: string, message: string) =>
  realtime.sendChildEncouragement(childId, message);

// Child-friendly message generators for real-time updates
export const REALTIME_MESSAGES = {
  PROCESSING_STARTED: "🚀 Starting to work on your questions...",
  PROCESSING_QUESTIONS: (progress: number) => `🔍 Working on your questions... ${progress}% done!`,
  GENERATING_DISTRACTORS: "🤖 Creating answer choices for you...",
  ALMOST_DONE: "⭐ Almost finished! Just a few more seconds...",
  PROCESSING_COMPLETE: "🎉 All done! Your questions are ready to practice!",
  PROCESSING_FAILED: "😅 Oops! Something went wrong. Let's try again!",
  
  SESSION_STARTED: "🎯 Practice session started! Good luck!",
  QUESTION_ANSWERED: (correct: boolean) => correct ? "✅ Great job!" : "💪 Keep trying!",
  SESSION_HALFWAY: "🌟 You're halfway through! Keep going!",
  SESSION_COMPLETE: "🏆 Practice session complete! Check out your results!",
  
  ENCOURAGEMENT_GENERAL: [
    "🌟 You're doing amazing!",
    "💪 Keep up the great work!",
    "🚀 You're learning so much!",
    "⭐ Every question makes you smarter!",
    "🎯 Focus and you've got this!"
  ]
} as const;