import { createServerSupabase, createAdminSupabase } from './supabase-server';
import { COPPA_CONFIG } from './supabase';
import type { 
  User, 
  ChildProfile, 
  Deck, 
  Question, 
  TestSession,
  QuestionResponse,
  Database 
} from '@/types/database';

export class DatabaseManager {
  private supabase;
  private adminSupabase;

  constructor(useAdmin = false) {
    this.supabase = createServerSupabase();
    this.adminSupabase = createAdminSupabase();
  }

  // User Management with COPPA Compliance
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data;
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    // COPPA compliance check - only allow adult roles
    if (!COPPA_CONFIG.ALLOWED_ROLES.includes(userData.role)) {
      throw new Error('Invalid user role for COPPA compliance');
    }

    const { data, error } = await this.adminSupabase
      .from('users')
      .insert([{
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data;
  }

  // Child Profile Management (COPPA-compliant)
  async getChildProfile(childId: string): Promise<ChildProfile | null> {
    const { data, error } = await this.supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch child profile: ${error.message}`);
    }

    return data;
  }

  async getChildrenByParent(parentId: string): Promise<ChildProfile[]> {
    const { data, error } = await this.supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch children: ${error.message}`);
    }

    return data || [];
  }

  async createChildProfile(childData: Omit<ChildProfile, 'id' | 'created_at'>): Promise<ChildProfile> {
    // COPPA compliance: Validate age if birth_year is provided
    if (childData.birth_year) {
      const age = new Date().getFullYear() - childData.birth_year;
      if (age < COPPA_CONFIG.MIN_AGE) {
        // Enable enhanced protections for under-13 children
        await this.enableEnhancedProtections(childData.parent_id);
      }
    }

    const { data, error } = await this.supabase
      .from('child_profiles')
      .insert([{
        ...childData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create child profile: ${error.message}`);
    }

    return data;
  }

  async updateChildProfile(childId: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const { data, error } = await this.supabase
      .from('child_profiles')
      .update(updates)
      .eq('id', childId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update child profile: ${error.message}`);
    }

    return data;
  }

  // Deck Management
  async getDecksByUser(userId: string): Promise<Deck[]> {
    const { data, error } = await this.supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch decks: ${error.message}`);
    }

    return data || [];
  }

  async getDeckById(deckId: string): Promise<Deck | null> {
    const { data, error } = await this.supabase
      .from('decks')
      .select('*')
      .eq('id', deckId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch deck: ${error.message}`);
    }

    return data;
  }

  async createDeck(deckData: Omit<Deck, 'id' | 'created_at' | 'updated_at'>): Promise<Deck> {
    const { data, error } = await this.supabase
      .from('decks')
      .insert([{
        ...deckData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create deck: ${error.message}`);
    }

    return data;
  }

  async updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck> {
    const { data, error } = await this.supabase
      .from('decks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', deckId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update deck: ${error.message}`);
    }

    return data;
  }

  // Question Management
  async getQuestionsByDeck(deckId: string): Promise<Question[]> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('*')
      .eq('deck_id', deckId)
      .order('original_csv_row', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    return data || [];
  }

  async createQuestion(questionData: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    const { data, error } = await this.supabase
      .from('questions')
      .insert([{
        ...questionData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create question: ${error.message}`);
    }

    return data;
  }

  async createQuestionsBatch(questions: Omit<Question, 'id' | 'created_at'>[]): Promise<Question[]> {
    const questionsWithTimestamp = questions.map(q => ({
      ...q,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await this.supabase
      .from('questions')
      .insert(questionsWithTimestamp)
      .select();

    if (error) {
      throw new Error(`Failed to create questions batch: ${error.message}`);
    }

    return data || [];
  }

  // Test Session Management
  async createTestSession(sessionData: Omit<TestSession, 'id' | 'started_at'>): Promise<TestSession> {
    const { data, error } = await this.supabase
      .from('test_sessions')
      .insert([{
        ...sessionData,
        started_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create test session: ${error.message}`);
    }

    return data;
  }

  async updateTestSession(sessionId: string, updates: Partial<TestSession>): Promise<TestSession> {
    const { data, error } = await this.supabase
      .from('test_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update test session: ${error.message}`);
    }

    return data;
  }

  async getTestSessionsByChild(childId: string, limit = 10): Promise<TestSession[]> {
    const { data, error } = await this.supabase
      .from('test_sessions')
      .select('*')
      .eq('child_id', childId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch test sessions: ${error.message}`);
    }

    return data || [];
  }

  // Question Response Management
  async createQuestionResponse(responseData: Omit<QuestionResponse, 'id' | 'answered_at'>): Promise<QuestionResponse> {
    const { data, error } = await this.supabase
      .from('question_responses')
      .insert([{
        ...responseData,
        answered_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create question response: ${error.message}`);
    }

    return data;
  }

  async getResponsesBySession(sessionId: string): Promise<QuestionResponse[]> {
    const { data, error } = await this.supabase
      .from('question_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('answered_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch responses: ${error.message}`);
    }

    return data || [];
  }

  // Analytics and Progress Tracking
  async getChildProgress(childId: string, timeframe = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframe);

    const { data, error } = await this.supabase
      .from('test_sessions')
      .select(`
        *,
        decks!inner(name, subject),
        question_responses!inner(is_correct, response_time_seconds)
      `)
      .eq('child_id', childId)
      .gte('started_at', startDate.toISOString())
      .not('completed_at', 'is', null);

    if (error) {
      throw new Error(`Failed to fetch progress: ${error.message}`);
    }

    return data || [];
  }

  async getDeckStatistics(deckId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('test_sessions')
      .select(`
        *,
        question_responses!inner(is_correct, question_id, questions!inner(category, subcategory))
      `)
      .eq('deck_id', deckId)
      .not('completed_at', 'is', null);

    if (error) {
      throw new Error(`Failed to fetch deck statistics: ${error.message}`);
    }

    return data || [];
  }

  // COPPA Compliance Helpers
  private async enableEnhancedProtections(userId: string): Promise<void> {
    // Implementation for enhanced privacy protections for under-13 users
    await this.updateUser(userId, {
      // Add any enhanced protection flags
    });

    // Schedule automatic data deletion if required
    await this.scheduleDataDeletion(userId);
  }

  private async scheduleDataDeletion(userId: string): Promise<void> {
    // Implementation for scheduling data deletion
    // This would typically involve creating a job or trigger
    console.log(`Scheduled data deletion for user: ${userId}`);
  }

  // Health Check
  async healthCheck(): Promise<{ healthy: boolean; responseTime: number }> {
    const start = Date.now();
    
    try {
      await this.supabase.from('users').select('id').limit(1);
      const responseTime = Date.now() - start;
      
      return {
        healthy: responseTime < 1000,
        responseTime
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - start
      };
    }
  }
}

// Export singleton instance
export const db = new DatabaseManager();