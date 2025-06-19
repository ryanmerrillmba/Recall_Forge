# Backend Architecture for RecallForge
## Comprehensive Backend System Design

### Project Overview
RecallForge is an elementary school flashcard platform that converts CSV files into AI-generated multiple choice tests. The backend must handle child users safely, process AI requests efficiently, and scale from web to mobile applications.

---

## System Architecture Overview

### Architecture Philosophy
- **Serverless-First**: Leverage Supabase and Cloudflare Workers for automatic scaling
- **Child-Safe Design**: COPPA-compliant data handling and security
- **AI-Optimized**: Efficient OpenAI integration with cost controls
- **Mobile-Ready**: API design optimized for future React Native apps
- **Performance-First**: Sub-second response times for child attention spans

### Technology Stack
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with custom middleware
- **API Layer**: Supabase Edge Functions + Cloudflare Workers
- **AI Integration**: OpenAI GPT-4.1 mini via custom proxy
- **Payment Processing**: Stripe with COPPA-compliant billing
- **Email Marketing**: Beehiiv integration for parent/teacher communication
- **Caching**: Redis via Upstash
- **File Storage**: Supabase Storage
- **Queue System**: Supabase Edge Functions with PostgreSQL queues
- **Monitoring**: Sentry + Custom metrics

---

## Database Design & Schema

### Core Tables Structure

#### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role VARCHAR(20) CHECK (role IN ('parent', 'teacher', 'admin')) DEFAULT 'parent',
  subscription_status VARCHAR(20) CHECK (subscription_status IN ('free', 'individual', 'family', 'educator')) DEFAULT 'free',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  email_marketing_consent BOOLEAN DEFAULT false,
  beehiiv_subscriber_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription ON users(subscription_status);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

#### **Subscription Billing Table**
```sql
CREATE TABLE subscription_billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount_paid INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',
  billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('paid', 'pending', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_billing_user_id ON subscription_billing(user_id);
CREATE INDEX idx_billing_invoice ON subscription_billing(stripe_invoice_id);
CREATE INDEX idx_billing_status ON subscription_billing(status);

#### **Email Marketing Subscribers Table**
```sql
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  beehiiv_subscriber_id VARCHAR(255) UNIQUE,
  subscription_type VARCHAR(20) CHECK (subscription_type IN ('parent_updates', 'teacher_resources', 'product_announcements')) DEFAULT 'parent_updates',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  double_opt_in_confirmed BOOLEAN DEFAULT false,
  source VARCHAR(50) DEFAULT 'website_footer', -- tracking signup source
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_email_subscribers_user_id ON email_subscribers(user_id);
CREATE INDEX idx_email_subscribers_beehiiv ON email_subscribers(beehiiv_subscriber_id);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_active ON email_subscribers(is_active);
```

#### **Child Profiles Table**
```sql
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
  birth_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  
  CONSTRAINT valid_birth_year CHECK (birth_year >= 2000 AND birth_year <= EXTRACT(YEAR FROM NOW()))
);

CREATE INDEX idx_child_profiles_parent_id ON child_profiles(parent_id);
CREATE INDEX idx_child_profiles_grade ON child_profiles(grade_level);
```

#### **Decks Table**
```sql
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  subject VARCHAR(100) DEFAULT 'Latin',
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  csv_filename VARCHAR(255),
  processing_status VARCHAR(20) CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  ai_processing_metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_child_id ON decks(child_id);
CREATE INDEX idx_decks_status ON decks(processing_status);
CREATE INDEX idx_decks_subject ON decks(subject);
```

#### **Questions Table**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  distractor_1 TEXT NOT NULL,
  distractor_2 TEXT NOT NULL,
  distractor_3 TEXT NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT true,
  original_csv_row INTEGER
);

CREATE INDEX idx_questions_deck_id ON questions(deck_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_subcategory ON questions(subcategory);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
```

#### **Test Sessions Table**
```sql
CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  score_percentage DECIMAL(5,2),
  session_type VARCHAR(20) CHECK (session_type IN ('practice', 'test', 'review')) DEFAULT 'practice'
);

CREATE INDEX idx_test_sessions_child_id ON test_sessions(child_id);
CREATE INDEX idx_test_sessions_deck_id ON test_sessions(deck_id);
CREATE INDEX idx_test_sessions_completed ON test_sessions(completed_at);
```

#### **Question Responses Table**
```sql
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_question_responses_question_id ON question_responses(question_id);
CREATE INDEX idx_question_responses_correct ON question_responses(is_correct);
```

### Database Optimization Strategies

#### **Indexing Strategy**
- Primary keys with UUID for distributed scaling
- Composite indexes for common query patterns
- Partial indexes for frequently filtered boolean columns
- Expression indexes for JSON queries

#### **Query Optimization**
```sql
-- Optimized query for child's deck performance
CREATE INDEX idx_child_deck_performance ON test_sessions(child_id, deck_id, completed_at DESC) 
WHERE completed_at IS NOT NULL;

-- Optimized query for question difficulty analysis
CREATE INDEX idx_question_performance ON question_responses(question_id, is_correct) 
INCLUDE (response_time_seconds);
```

#### **Data Partitioning**
```sql
-- Partition test_sessions by month for performance
CREATE TABLE test_sessions_y2024m01 PARTITION OF test_sessions 
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## API Architecture & Endpoints

### Authentication Layer

#### **Custom Auth Middleware**
```typescript
interface AuthContext {
  user: User;
  child?: ChildProfile;
  role: 'parent' | 'teacher' | 'admin';
  permissions: string[];
}

async function authMiddleware(request: Request): Promise<AuthContext> {
  const token = extractBearerToken(request);
  const user = await supabase.auth.getUser(token);
  
  // COPPA compliance check
  if (user.role === 'child') {
    throw new Error('Direct child authentication not allowed');
  }
  
  return {
    user,
    role: user.role,
    permissions: await getUserPermissions(user.id)
  };
}
```

### RESTful API Design

#### **Deck Management Endpoints**
```typescript
// GET /api/decks - List user's decks
interface DeckListResponse {
  decks: Array<{
    id: string;
    name: string;
    description: string;
    totalQuestions: number;
    lastScore?: number;
    lastTestDate?: string;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    categories: Array<{
      name: string;
      questionCount: number;
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// POST /api/decks - Create new deck from CSV
interface DeckCreateRequest {
  name: string;
  description?: string;
  childId: string;
  csvFile: File;
}

interface DeckCreateResponse {
  deckId: string;
  processingJobId: string;
  estimatedCompletionTime: number; // seconds
}

// GET /api/decks/:id - Get deck details
interface DeckDetailResponse {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  categories: Array<{
    name: string;
    subcategories: Array<{
      name: string;
      questionCount: number;
      averageScore: number;
    }>;
  }>;
  recentSessions: TestSession[];
  performanceMetrics: {
    averageScore: number;
    improvementTrend: number;
    timeSpentMinutes: number;
    strongestCategories: string[];
    weakestCategories: string[];
  };
}
```

#### **Test Session Endpoints**
```typescript
// POST /api/sessions - Start new test session
interface SessionStartRequest {
  deckId: string;
  childId: string;
  sessionType: 'practice' | 'test' | 'review';
  questionCount?: number;
  categories?: string[];
}

interface SessionStartResponse {
  sessionId: string;
  questions: Array<{
    id: string;
    questionText: string;
    options: string[]; // Randomized order
    category: string;
    subcategory: string;
  }>;
  timeLimit?: number;
}

// POST /api/sessions/:id/answer - Submit answer
interface AnswerSubmitRequest {
  questionId: string;
  selectedAnswer: string;
  responseTimeSeconds: number;
}

interface AnswerSubmitResponse {
  isCorrect: boolean;
  correctAnswer?: string;
  explanation?: string;
  encouragementMessage: string;
}

// POST /api/sessions/:id/complete - Complete session
interface SessionCompleteResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  durationSeconds: number;
  categoryBreakdown: Array<{
    category: string;
    correct: number;
    total: number;
  }>;
  achievements: string[];
  encouragementMessage: string;
}
```

### Error Handling Standards

#### **Standardized Error Responses**
```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    childFriendlyMessage?: string;
    recoveryActions?: string[];
  };
  requestId: string;
  timestamp: string;
}

// Child-friendly error messages
const ERROR_MESSAGES = {
  DECK_PROCESSING_FAILED: {
    technical: "AI processing failed for deck creation",
    childFriendly: "Oops! We're having trouble with your questions. Let's try again!",
    recoveryActions: ["Try uploading the file again", "Check if your CSV file is formatted correctly"]
  },
  SESSION_TIMEOUT: {
    technical: "Session expired due to inactivity",
    childFriendly: "You've been away for a while! Let's start fresh.",
    recoveryActions: ["Start a new practice session"]
  }
};
```

#### **Rate Limiting Strategy**
```typescript
const RATE_LIMITS = {
  // Child-safe limits
  'child-session': { requests: 100, window: '1h', burst: 10 },
  'csv-upload': { requests: 5, window: '1h', burst: 2 },
  'ai-processing': { requests: 10, window: '1h', burst: 3 },
  
  // Parent/teacher limits
  'parent-api': { requests: 1000, window: '1h', burst: 50 },
  'bulk-operations': { requests: 20, window: '1h', burst: 5 }
};
```

---

## AI Integration Backend

### OpenAI Gateway Architecture

#### **Custom AI Proxy Service**
```typescript
class AIService {
  private openai: OpenAI;
  private rateLimiter: RateLimiter;
  private costTracker: CostTracker;

  async generateDistractors(
    question: string, 
    correctAnswer: string, 
    context: string[]
  ): Promise<DistractorResult> {
    
    // Cost check
    await this.costTracker.checkBudget('distractor-generation');
    
    // Rate limit check
    await this.rateLimiter.checkLimit('ai-requests');
    
    const prompt = this.buildDistractorPrompt(question, correctAnswer, context);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
        response_format: { type: 'json_object' }
      });
      
      const result = this.parseDistractorResponse(response);
      await this.costTracker.recordUsage(response.usage);
      
      return result;
    } catch (error) {
      // Fallback to rule-based generation
      return this.generateFallbackDistractors(question, correctAnswer, context);
    }
  }

  private buildDistractorPrompt(question: string, correctAnswer: string, context: string[]): string {
    return `
Generate exactly 3 incorrect but plausible answers for this Latin vocabulary question.
The distractors should be similar enough to the correct answer to be challenging but clearly wrong.

Question: ${question}
Correct Answer: ${correctAnswer}
Context (other answers in this deck): ${context.slice(0, 10).join(', ')}

Rules:
1. Generate exactly 3 distractors
2. Make them plausible but incorrect
3. Appropriate for elementary school students
4. No inappropriate content
5. Return as JSON: {"distractors": ["option1", "option2", "option3"]}

Response:`;
  }
}
```

#### **Batch Processing System**
```typescript
interface CSVProcessingJob {
  id: string;
  deckId: string;
  userId: string;
  csvData: Array<{question: string; answer: string}>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
}

class CSVProcessor {
  async processCSV(job: CSVProcessingJob): Promise<void> {
    try {
      await this.updateJobStatus(job.id, 'processing', 0);
      
      const questions = job.csvData;
      const batchSize = 5; // Process 5 questions at a time
      
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(q => this.processQuestion(q, questions))
        );
        
        await this.saveQuestionBatch(job.deckId, results);
        
        const progress = Math.min(100, ((i + batchSize) / questions.length) * 100);
        await this.updateJobStatus(job.id, 'processing', progress);
        
        // Brief pause to avoid rate limits
        await this.sleep(1000);
      }
      
      await this.updateJobStatus(job.id, 'completed', 100);
      await this.notifyCompletion(job.userId, job.deckId);
      
    } catch (error) {
      await this.updateJobStatus(job.id, 'failed', 0);
      await this.notifyError(job.userId, error);
    }
  }
}
```

### Cost Optimization Strategies

#### **Intelligent Caching**
```typescript
class AICache {
  private redis: Redis;
  
  async getCachedDistractors(question: string, answer: string): Promise<string[] | null> {
    const key = this.generateCacheKey(question, answer);
    const cached = await this.redis.get(key);
    
    if (cached) {
      // Extend TTL on cache hit
      await this.redis.expire(key, 86400 * 7); // 7 days
      return JSON.parse(cached);
    }
    
    return null;
  }
  
  async cacheDistractors(question: string, answer: string, distractors: string[]): Promise<void> {
    const key = this.generateCacheKey(question, answer);
    await this.redis.setex(key, 86400 * 7, JSON.stringify(distractors));
  }
  
  private generateCacheKey(question: string, answer: string): string {
    const hash = crypto.createHash('md5')
      .update(question.toLowerCase() + answer.toLowerCase())
      .digest('hex');
    return `distractors:${hash}`;
  }
}
```

#### **Request Batching**
```typescript
class BatchProcessor {
  private queue: Array<{question: string; answer: string; resolve: Function; reject: Function}> = [];
  private timer: NodeJS.Timeout | null = null;
  
  async batchDistractorGeneration(question: string, answer: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.queue.push({ question, answer, resolve, reject });
      
      if (!this.timer) {
        this.timer = setTimeout(() => this.processBatch(), 2000);
      }
    });
  }
  
  private async processBatch(): Promise<void> {
    const batch = this.queue.splice(0);
    this.timer = null;
    
    if (batch.length === 0) return;
    
    try {
      const prompt = this.buildBatchPrompt(batch);
      const response = await this.aiService.generateBatch(prompt);
      
      // Distribute results back to waiting promises
      batch.forEach((item, index) => {
        item.resolve(response.results[index]);
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
  }
}
```

---

## File Processing Pipeline

### CSV Upload Handler

#### **Secure File Processing**
```typescript
class CSVUploadHandler {
  async handleUpload(file: File, userId: string): Promise<{deckId: string; jobId: string}> {
    // Validate file
    await this.validateCSVFile(file);
    
    // Scan for security issues
    await this.scanFileContent(file);
    
    // Parse CSV data
    const csvData = await this.parseCSV(file);
    
    // Validate content appropriateness
    await this.validateContent(csvData);
    
    // Create deck record
    const deckId = await this.createDeck(userId, file.name, csvData.length);
    
    // Queue processing job
    const jobId = await this.queueProcessingJob(deckId, csvData);
    
    return { deckId, jobId };
  }
  
  private async validateCSVFile(file: File): Promise<void> {
    // File size check (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new APIError('FILE_TOO_LARGE', 'CSV file must be smaller than 10MB');
    }
    
    // File type check
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      throw new APIError('INVALID_FILE_TYPE', 'Please upload a CSV file');
    }
    
    // Basic CSV structure validation
    const preview = await this.readFilePreview(file, 1000);
    if (!this.isValidCSVStructure(preview)) {
      throw new APIError('INVALID_CSV_STRUCTURE', 'CSV must have Question and Answer columns');
    }
  }
  
  private async validateContent(csvData: Array<{question: string; answer: string}>): Promise<void> {
    // Check for inappropriate content
    for (const row of csvData) {
      if (await this.containsInappropriateContent(row.question) || 
          await this.containsInappropriateContent(row.answer)) {
        throw new APIError('INAPPROPRIATE_CONTENT', 'Content must be appropriate for children');
      }
    }
    
    // Check for minimum/maximum questions
    if (csvData.length < 5) {
      throw new APIError('TOO_FEW_QUESTIONS', 'Please provide at least 5 questions');
    }
    
    if (csvData.length > 500) {
      throw new APIError('TOO_MANY_QUESTIONS', 'Please limit to 500 questions per deck');
    }
  }
}
```

### Real-time Progress Tracking

#### **WebSocket Progress Updates**
```typescript
class ProgressTracker {
  private connections: Map<string, WebSocket> = new Map();
  
  async trackJobProgress(jobId: string, userId: string): Promise<void> {
    const ws = this.connections.get(userId);
    if (!ws) return;
    
    const job = await this.getJobStatus(jobId);
    
    ws.send(JSON.stringify({
      type: 'job_progress',
      jobId,
      status: job.status,
      progress: job.progress,
      message: this.getChildFriendlyMessage(job.status, job.progress)
    }));
  }
  
  private getChildFriendlyMessage(status: string, progress: number): string {
    switch (status) {
      case 'pending':
        return "Getting ready to work on your questions...";
      case 'processing':
        return `Working on your questions... ${progress}% done!`;
      case 'completed':
        return "All done! Your questions are ready to practice!";
      case 'failed':
        return "Oops! Something went wrong. Let's try again!";
      default:
        return "Processing your questions...";
    }
  }
}
```

---

## Performance & Scaling

### Connection Pool Management

#### **Database Connection Optimization**
```typescript
const supabaseConfig = {
  connectionPool: {
    min: 2,
    max: 20,
    idle: 30000,
    acquire: 60000,
    evict: 1000
  },
  ssl: true,
  statement_timeout: 30000,
  query_timeout: 30000
};

class DatabaseManager {
  private pool: Pool;
  
  async executeQuery<T>(query: string, params: any[]): Promise<T> {
    const client = await this.pool.connect();
    const startTime = Date.now();
    
    try {
      const result = await client.query(query, params);
      
      // Log slow queries
      const duration = Date.now() - startTime;
      if (duration > 1000) {
        logger.warn('Slow query detected', { query, duration, params });
      }
      
      return result.rows;
    } finally {
      client.release();
    }
  }
}
```

### Caching Strategy

#### **Multi-Layer Caching System**
```typescript
class CacheManager {
  private redis: Redis;
  private memoryCache: LRUCache;
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    let value = this.memoryCache.get(key);
    if (value) {
      return value as T;
    }
    
    // L2: Redis cache
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      value = JSON.parse(redisValue);
      this.memoryCache.set(key, value);
      return value as T;
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // Set in both caches
    this.memoryCache.set(key, value);
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  // Cache strategies for different data types
  async getCachedDeckList(userId: string): Promise<Deck[] | null> {
    return this.get(`decks:user:${userId}`);
  }
  
  async cacheTestSession(sessionId: string, session: TestSession): Promise<void> {
    await this.set(`session:${sessionId}`, session, 7200); // 2 hours
  }
}
```

### Background Job Processing

#### **Queue Management System**
```typescript
interface Job {
  id: string;
  type: 'csv_processing' | 'ai_generation' | 'report_generation';
  payload: any;
  priority: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledFor?: Date;
}

class JobQueue {
  private jobs: PriorityQueue<Job> = new PriorityQueue();
  private processing: Set<string> = new Set();
  
  async addJob(type: string, payload: any, priority: number = 0): Promise<string> {
    const job: Job = {
      id: uuidv4(),
      type: type as Job['type'],
      payload,
      priority,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    };
    
    this.jobs.enqueue(job, priority);
    this.processNext();
    
    return job.id;
  }
  
  private async processNext(): Promise<void> {
    if (this.processing.size >= 5) return; // Max concurrent jobs
    
    const job = this.jobs.dequeue();
    if (!job) return;
    
    this.processing.add(job.id);
    
    try {
      await this.executeJob(job);
      await this.markJobCompleted(job.id);
    } catch (error) {
      await this.handleJobError(job, error);
    } finally {
      this.processing.delete(job.id);
      this.processNext(); // Process next job
    }
  }
  
  private async executeJob(job: Job): Promise<void> {
    switch (job.type) {
      case 'csv_processing':
        await this.csvProcessor.process(job.payload);
        break;
      case 'ai_generation':
        await this.aiService.generate(job.payload);
        break;
      case 'report_generation':
        await this.reportGenerator.generate(job.payload);
        break;
    }
  }
}
```

---

## Security & Compliance

### COPPA Compliance Implementation

#### **Child Data Protection**
```typescript
class COPPACompliance {
  async validateChildAccount(childData: ChildProfile): Promise<void> {
    // Age verification
    const age = this.calculateAge(childData.birthYear);
    if (age < 13) {
      // Enhanced protections for under-13
      await this.enableEnhancedProtections(childData.id);
    }
    
    // Data minimization
    await this.minimizeDataCollection(childData);
    
    // Parental consent verification
    await this.verifyParentalConsent(childData.parentId);
  }
  
  async enableEnhancedProtections(childId: string): Promise<void> {
    // Disable direct communication features
    // Enable automatic data deletion schedules
    // Restrict data sharing
    // Enable enhanced monitoring
    
    await this.database.query(
      'UPDATE child_profiles SET privacy_level = $1 WHERE id = $2',
      ['enhanced', childId]
    );
  }
  
  async scheduleDataDeletion(childId: string): Promise<void> {
    // COPPA requires ability to delete child data on request
    const deletionJob = {
      type: 'data_deletion',
      childId,
      scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
    
    await this.jobQueue.addJob('data_deletion', deletionJob);
  }
}
```

### Content Security & Filtering

#### **Inappropriate Content Detection**
```typescript
class ContentFilter {
  private bannedWords: Set<string>;
  private patterns: RegExp[];
  
  async validateContent(text: string): Promise<boolean> {
    // Basic word filtering
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (this.bannedWords.has(word)) {
        return false;
      }
    }
    
    // Pattern matching
    for (const pattern of this.patterns) {
      if (pattern.test(text)) {
        return false;
      }
    }
    
    // Advanced AI-based filtering (optional)
    if (await this.aiModerationCheck(text)) {
      return false;
    }
    
    return true;
  }
  
  private async aiModerationCheck(text: string): Promise<boolean> {
    try {
      const response = await this.openai.moderations.create({
        input: text
      });
      
      return response.results[0].flagged;
    } catch (error) {
      // Fail safe - assume content is safe if moderation fails
      logger.warn('Content moderation failed', { error });
      return false;
    }
  }
}
```

---

## Error Handling & Monitoring

### Centralized Error Management

#### **Error Handler Middleware**
```typescript
class ErrorHandler {
  async handleError(error: Error, context: RequestContext): Promise<APIError> {
    // Log error with correlation ID
    const correlationId = context.correlationId || uuidv4();
    
    logger.error('API Error', {
      correlationId,
      error: error.message,
      stack: error.stack,
      userId: context.user?.id,
      endpoint: context.endpoint,
      userAgent: context.userAgent
    });
    
    // Send to Sentry for monitoring
    Sentry.captureException(error, {
      tags: {
        endpoint: context.endpoint,
        userId: context.user?.id
      },
      extra: {
        correlationId,
        requestBody: context.body
      }
    });
    
    // Return appropriate error response
    return this.formatErrorResponse(error, correlationId);
  }
  
  private formatErrorResponse(error: Error, correlationId: string): APIError {
    if (error instanceof ValidationError) {
      return {
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          childFriendlyMessage: 'Please check your information and try again.',
          recoveryActions: ['Check the form for any missing or incorrect information']
        },
        requestId: correlationId,
        timestamp: new Date().toISOString()
      };
    }
    
    if (error instanceof AIProcessingError) {
      return {
        error: {
          code: 'AI_PROCESSING_ERROR',
          message: 'AI service temporarily unavailable',
          childFriendlyMessage: 'Our helper robot is taking a break! Let\'s try again in a moment.',
          recoveryActions: ['Wait a few minutes and try again', 'Contact support if problem persists']
        },
        requestId: correlationId,
        timestamp: new Date().toISOString()
      };
    }
    
    // Generic error
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        childFriendlyMessage: 'Oops! Something unexpected happened. Let\'s try again!',
        recoveryActions: ['Try refreshing the page', 'Contact support if problem continues']
      },
      requestId: correlationId,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Health Monitoring System

#### **System Health Checks**
```typescript
class HealthMonitor {
  async performHealthCheck(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkAIService(),
      this.checkFileStorage(),
      this.checkExternalAPIs()
    ]);
    
    const results = checks.map((check, index) => ({
      service: ['database', 'redis', 'ai', 'storage', 'external'][index],
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      details: check.status === 'fulfilled' ? check.value : check.reason
    }));
    
    const overallStatus = results.every(r => r.status === 'healthy') ? 'healthy' : 'degraded';
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: results,
      version: process.env.APP_VERSION || 'unknown'
    };
  }
  
  private async checkDatabase(): Promise<any> {
    const start = Date.now();
    await this.database.query('SELECT 1');
    const responseTime = Date.now() - start;
    
    return {
      responseTime,
      healthy: responseTime < 1000
    };
  }
  
  private async checkAIService(): Promise<any> {
    try {
      const start = Date.now();
      await this.aiService.healthCheck();
      const responseTime = Date.now() - start;
      
      return {
        responseTime,
        healthy: responseTime < 5000,
        quotaRemaining: await this.aiService.getQuotaRemaining()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }
}
```

---

## Real-time Features

### WebSocket Implementation

#### **Real-time Progress & Notifications**
```typescript
class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();
  
  handleConnection(ws: WebSocket, userId: string): void {
    this.connections.set(userId, ws);
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      this.handleMessage(userId, message);
    });
    
    ws.on('close', () => {
      this.connections.delete(userId);
      this.cleanupSubscriptions(userId);
    });
    
    // Send welcome message
    this.sendToUser(userId, {
      type: 'connected',
      message: 'Ready to learn together!'
    });
  }
  
  subscribeToJob(userId: string, jobId: string): void {
    if (!this.subscriptions.has(jobId)) {
      this.subscriptions.set(jobId, new Set());
    }
    this.subscriptions.get(jobId)!.add(userId);
  }
  
  broadcastJobUpdate(jobId: string, update: JobUpdate): void {
    const subscribers = this.subscriptions.get(jobId);
    if (!subscribers) return;
    
    for (const userId of subscribers) {
      this.sendToUser(userId, {
        type: 'job_update',
        jobId,
        ...update
      });
    }
  }
  
  sendChildEncouragement(childId: string, message: string): void {
    // Send encouraging messages during long processing
    const userId = this.getUserIdForChild(childId);
    if (userId) {
      this.sendToUser(userId, {
        type: 'encouragement',
        message,
        childId
      });
    }
  }
}
```

---

## Testing Strategy

### Comprehensive Test Suite

#### **Unit Testing**
```typescript
describe('AIService', () => {
  let aiService: AIService;
  let mockOpenAI: jest.Mocked<OpenAI>;
  
  beforeEach(() => {
    mockOpenAI = createMockOpenAI();
    aiService = new AIService(mockOpenAI);
  });
  
  describe('generateDistractors', () => {
    it('should generate 3 plausible distractors', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              distractors: ['wrong1', 'wrong2', 'wrong3']
            })
          }
        }],
        usage: { total_tokens: 100 }
      };
      
      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);
      
      const result = await aiService.generateDistractors(
        'What does "aqua" mean?',
        'water',
        ['fire', 'earth', 'air']
      );
      
      expect(result.distractors).toHaveLength(3);
      expect(result.distractors).not.toContain('water');
    });
    
    it('should fallback to rule-based generation on AI failure', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));
      
      const result = await aiService.generateDistractors(
        'What does "aqua" mean?',
        'water',
        ['fire', 'earth', 'air', 'wind', 'stone']
      );
      
      expect(result.distractors).toHaveLength(3);
      expect(result.source).toBe('fallback');
    });
  });
});
```

#### **Integration Testing**
```typescript
describe('CSV Processing Integration', () => {
  let testDb: Database;
  let csvProcessor: CSVProcessor;
  
  beforeEach(async () => {
    testDb = await createTestDatabase();
    csvProcessor = new CSVProcessor(testDb);
  });
  
  it('should process CSV end-to-end', async () => {
    const csvData = [
      { question: 'What does "casa" mean?', answer: 'house' },
      { question: 'What does "agua" mean?', answer: 'water' }
    ];
    
    const job = await csvProcessor.createJob('user-123', 'deck-456', csvData);
    await csvProcessor.processJob(job.id);
    
    const questions = await testDb.getQuestionsByDeck('deck-456');
    
    expect(questions).toHaveLength(2);
    expect(questions[0].distractors).toHaveLength(3);
    expect(questions[0].category).toBeDefined();
    expect(questions[0].subcategory).toBeDefined();
  });
});
```

#### **Load Testing Strategy**
```typescript
// Artillery.js configuration for load testing
const loadTestConfig = {
  target: 'https://api.recallforge.com',
  phases: [
    { duration: 60, arrivalRate: 10 }, // Warm up
    { duration: 300, arrivalRate: 50 }, // Normal load
    { duration: 120, arrivalRate: 100 }, // Peak load
    { duration: 60, arrivalRate: 200 } // Stress test
  ],
  scenarios: [
    {
      name: 'Child taking test',
      weight: 70,
      flow: [
        { post: { url: '/api/auth/login', json: { email: 'parent@test.com' } } },
        { post: { url: '/api/sessions', json: { deckId: '{{ deckId }}', childId: '{{ childId }}' } } },
        { post: { url: '/api/sessions/{{ sessionId }}/answer', json: { questionId: '{{ questionId }}', selectedAnswer: 'A' } } }
      ]
    },
    {
      name: 'CSV upload',
      weight: 20,
      flow: [
        { post: { url: '/api/auth/login' } },
        { post: { url: '/api/decks', formData: { csvFile: '@test-data.csv' } } }
      ]
    }
  ]
};
```

---

## Development Workflow

### CI/CD Pipeline

#### **GitHub Actions Workflow**
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY_TEST }}
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      
      - name: Run database migrations
        run: npm run migrate:prod
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
      
      - name: Health check
        run: |
          sleep 30
          curl -f https://api.recallforge.com/health || exit 1
```

### Database Migration Strategy

#### **Version-Controlled Migrations**
```sql
-- migrations/001_initial_schema.sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);

COMMIT;
```

```typescript
// Migration runner
class MigrationRunner {
  async runMigrations(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get current migration version
      const currentVersion = await this.getCurrentVersion(client);
      
      // Get pending migrations
      const migrations = await this.getPendingMigrations(currentVersion);
      
      for (const migration of migrations) {
        console.log(`Running migration: ${migration.name}`);
        await client.query(migration.sql);
        await this.updateMigrationVersion(client, migration.version);
      }
      
      await client.query('COMMIT');
      console.log('All migrations completed successfully');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

---

## Mobile App Preparation

### API Design for Cross-Platform

#### **Mobile-Optimized Endpoints**
```typescript
// Optimized for mobile bandwidth
interface MobileAPIResponse<T> {
  data: T;
  meta?: {
    timestamp: number;
    version: string;
    cacheUntil?: number;
  };
  sync?: {
    lastModified: number;
    etag: string;
  };
}

// Offline-first considerations
class OfflineSync {
  async syncDeck(deckId: string, lastSync?: number): Promise<DeckSyncResponse> {
    const response = await this.api.get(`/api/decks/${deckId}/sync`, {
      params: { since: lastSync }
    });
    
    return {
      deck: response.data.deck,
      questions: response.data.questions,
      deletedQuestions: response.data.deletedQuestions,
      timestamp: response.data.timestamp
    };
  }
  
  async syncTestResults(results: LocalTestResult[]): Promise<void> {
    // Batch upload offline test results
    await this.api.post('/api/sessions/batch', {
      results: results.map(r => ({
        ...r,
        syncId: r.localId // For deduplication
      }))
    });
  }
}
```

### Push Notification System

#### **Cross-Platform Notifications**
```typescript
class NotificationService {
  async sendChildEncouragement(childId: string): Promise<void> {
    const child = await this.getChild(childId);
    const parentDevices = await this.getParentDevices(child.parentId);
    
    const message = {
      title: `Great job, ${child.name}!`,
      body: 'Time for your daily Latin practice adventure!',
      data: {
        type: 'practice_reminder',
        childId,
        deckId: child.currentDeck
      }
    };
    
    await Promise.all(
      parentDevices.map(device => 
        this.sendNotification(device.token, message, device.platform)
      )
    );
  }
  
  private async sendNotification(
    token: string, 
    message: any, 
    platform: 'ios' | 'android'
  ): Promise<void> {
    if (platform === 'ios') {
      await this.sendAPNS(token, message);
    } else {
      await this.sendFCM(token, message);
    }
  }
}
```

---

## Payment Processing Integration (Stripe)

### COPPA-Compliant Billing Architecture

#### **Payment Service Layer**
```typescript
class PaymentService {
  private stripe: Stripe;
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }
  
  async createCustomer(parentUser: User): Promise<string> {
    // Only parents can be billing customers (COPPA compliance)
    if (parentUser.role !== 'parent' && parentUser.role !== 'teacher') {
      throw new Error('Only parents and teachers can create billing accounts');
    }
    
    const customer = await this.stripe.customers.create({
      email: parentUser.email,
      metadata: {
        userId: parentUser.id,
        platform: 'recallforge',
        role: parentUser.role
      }
    });
    
    // Update user record with Stripe customer ID
    await this.updateUserStripeCustomer(parentUser.id, customer.id);
    
    return customer.id;
  }
  
  async createSubscription(
    customerId: string, 
    priceId: string, 
    childrenCount: number = 1
  ): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
        quantity: Math.max(1, childrenCount) // Billing based on number of children
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 14, // 14-day free trial
      metadata: {
        childrenCount: childrenCount.toString(),
        platform: 'recallforge'
      }
    });
    
    return subscription;
  }
}
```

#### **Subscription Management**
```typescript
interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  priceId: string;
  features: string[];
  limits: {
    maxDecks: number;
    maxQuestionsPerDeck: number;
    maxChildren: number;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  };
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Trial',
    description: 'Perfect for trying RecallForge',
    priceId: '',
    features: ['5 flashcard decks', 'Basic progress tracking', '1 child profile', 'AI question generation'],
    limits: {
      maxDecks: 5,
      maxChildren: 1,
      advancedAnalytics: false,
      prioritySupport: false
    }
  },
  {
    id: 'individual',
    name: 'Individual Plan',
    description: 'Perfect for one child',
    priceId: 'price_individual_monthly',
    features: ['Unlimited decks', 'Basic analytics', '1 child profile', 'AI question generation', 'Web access'],
    limits: {
      maxDecks: -1, // unlimited
      maxChildren: 1,
      advancedAnalytics: false,
      prioritySupport: false
    }
  },
  {
    id: 'family',
    name: 'Family Plan',
    description: 'Unlimited learning for your whole family',
    priceId: 'price_family_monthly',
    features: ['Unlimited decks', 'Advanced analytics', 'Up to 5 children', 'Priority support', 'Mobile app access', 'Export progress reports'],
    limits: {
      maxDecks: -1, // unlimited
      maxChildren: 5,
      advancedAnalytics: true,
      prioritySupport: true
    }
  },
  {
    id: 'educator',
    name: 'Educator Plan',
    description: 'Complete classroom management solution',
    priceId: 'price_educator_monthly',
    features: ['Unlimited decks', 'Classroom management dashboard', 'Up to 30 students', 'Bulk CSV upload tools', 'Detailed student analytics', 'Curriculum alignment tools', 'Priority support with education specialist'],
    limits: {
      maxDecks: -1,
      maxChildren: 30, // students per class
      advancedAnalytics: true,
      prioritySupport: true
    }
  }
];

class SubscriptionManager {
  async checkUsageLimits(userId: string, action: string): Promise<boolean> {
    const user = await this.getUserWithSubscription(userId);
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === user.subscription_status);
    
    if (!tier) return false;
    
    switch (action) {
      case 'create_deck':
        if (tier.limits.maxDecks === -1) return true;
        const deckCount = await this.getUserDeckCount(userId);
        return deckCount < tier.limits.maxDecks;
        
      case 'add_child':
        const childCount = await this.getUserChildCount(userId);
        return childCount < tier.limits.maxChildren;
        
      default:
        return true;
    }
  }
}
```

#### **Webhook Processing**
```typescript
class StripeWebhookHandler {
  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }
  }
  
  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const customerId = subscription.customer as string;
    const user = await this.getUserByStripeCustomer(customerId);
    
    await this.updateUserSubscription(user.id, {
      subscription_status: this.mapStripePriceToTier(subscription.items.data[0].price.id),
      stripe_subscription_id: subscription.id,
      subscription_expires_at: new Date(subscription.current_period_end * 1000),
      trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
    });
    
    // Send welcome email via Beehiiv
    await this.emailService.sendWelcomeEmail(user.email, user.subscription_status);
  }
  
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const customerId = invoice.customer as string;
    const user = await this.getUserByStripeCustomer(customerId);
    
    // Implement graceful degradation - don't immediately cut off access
    await this.scheduleSubscriptionWarning(user.id);
    
    // Send payment failure notification to parent
    await this.emailService.sendPaymentFailureNotification(user.email);
  }
}
```

### Educational Pricing Strategy

#### **Usage-Based AI Costs**
```typescript
class AIUsageTracker {
  async trackAIUsage(userId: string, operation: 'distractor_generation' | 'categorization', cost: number): Promise<void> {
    await this.database.query(`
      INSERT INTO ai_usage_tracking (user_id, operation_type, cost_cents, created_at)
      VALUES ($1, $2, $3, NOW())
    `, [userId, operation, Math.round(cost * 100)]);
    
    // Track usage for analytics (no limits enforced)
  }
  
  async getMonthlyAIUsage(userId: string): Promise<number> {
    const result = await this.database.query(`
      SELECT COALESCE(SUM(cost_cents), 0) as total_cost
      FROM ai_usage_tracking
      WHERE user_id = $1
      AND created_at >= date_trunc('month', NOW())
    `, [userId]);
    
    return result.rows[0].total_cost;
  }
}
```

---

## Email Marketing Integration (Beehiiv)

### Newsletter Subscription Management

#### **Beehiiv API Integration**
```typescript
class BeehiivService {
  private apiKey: string;
  private publicationId: string;
  
  constructor() {
    this.apiKey = process.env.BEEHIIV_API_KEY!;
    this.publicationId = process.env.BEEHIIV_PUBLICATION_ID!;
  }
  
  async subscribeUser(
    email: string, 
    subscriptionType: 'parent_updates' | 'teacher_resources' | 'product_announcements',
    userMetadata: { role: string; childrenCount?: number }
  ): Promise<string> {
    
    // COPPA compliance: Only subscribe adults, never children
    if (userMetadata.role === 'child') {
      throw new Error('Cannot subscribe children to email marketing');
    }
    
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${this.publicationId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'recallforge_platform',
        utm_medium: subscriptionType,
        custom_fields: {
          user_role: userMetadata.role,
          children_count: userMetadata.childrenCount || 0,
          subscription_type: subscriptionType,
          signup_date: new Date().toISOString()
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Beehiiv subscription failed: ${data.message}`);
    }
    
    // Store subscription in our database
    await this.storeEmailSubscription(email, data.data.id, subscriptionType);
    
    return data.data.id;
  }
  
  async updateSubscriberSegment(
    subscriberId: string, 
    newSegment: string, 
    userProgress: { totalSessions: number; averageScore: number }
  ): Promise<void> {
    
    await fetch(`https://api.beehiiv.com/v2/publications/${this.publicationId}/subscriptions/${subscriberId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        custom_fields: {
          engagement_level: newSegment,
          total_sessions: userProgress.totalSessions,
          average_score: userProgress.averageScore,
          last_active: new Date().toISOString()
        }
      })
    });
  }
  
  async unsubscribeUser(subscriberId: string): Promise<void> {
    await fetch(`https://api.beehiiv.com/v2/publications/${this.publicationId}/subscriptions/${subscriberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    // Update our database
    await this.markEmailUnsubscribed(subscriberId);
  }
}
```

#### **Email Automation Triggers**
```typescript
class EmailAutomationService {
  async triggerWelcomeSequence(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    
    if (user.email_marketing_consent && user.beehiiv_subscriber_id) {
      // Trigger welcome email sequence based on user role
      const welcomeType = user.role === 'teacher' ? 'educator_welcome' : 'parent_welcome';
      
      await this.beehiivService.triggerAutomation(user.beehiiv_subscriber_id, welcomeType);
    }
  }
  
  async triggerEngagementEmail(userId: string, triggerType: string): Promise<void> {
    const user = await this.getUser(userId);
    
    if (!user.email_marketing_consent) return;
    
    const emailTriggers = {
      'first_deck_created': {
        subject: 'Great start! Your first RecallForge deck is ready',
        template: 'first_deck_success'
      },
      'week_without_practice': {
        subject: 'We miss you! Come back to continue learning',
        template: 're_engagement'
      },
      'milestone_achievement': {
        subject: 'Celebration time! Your child hit a learning milestone',
        template: 'milestone_celebration'
      }
    };
    
    const trigger = emailTriggers[triggerType];
    if (trigger && user.beehiiv_subscriber_id) {
      await this.beehiivService.sendCustomEmail(
        user.beehiiv_subscriber_id, 
        trigger.template,
        { childName: await this.getPrimaryChildName(userId) }
      );
    }
  }
  
  async segmentUsersByEngagement(): Promise<void> {
    const users = await this.getAllEmailSubscribers();
    
    for (const user of users) {
      const engagement = await this.calculateUserEngagement(user.id);
      const segment = this.determineEmailSegment(engagement);
      
      if (user.beehiiv_subscriber_id) {
        await this.beehiivService.updateSubscriberSegment(
          user.beehiiv_subscriber_id, 
          segment,
          engagement
        );
      }
    }
  }
  
  private determineEmailSegment(engagement: { 
    sessionsLastWeek: number; 
    averageScore: number; 
    daysSinceLastLogin: number 
  }): string {
    if (engagement.daysSinceLastLogin > 14) return 'dormant';
    if (engagement.sessionsLastWeek >= 5) return 'highly_engaged';
    if (engagement.sessionsLastWeek >= 2) return 'moderately_engaged';
    return 'low_engagement';
  }
}
```

### Newsletter Content Strategy

#### **Content Personalization**
```typescript
interface NewsletterContent {
  parentUpdates: {
    childProgressSummary: boolean;
    learningTips: boolean;
    platformUpdates: boolean;
    successStories: boolean; // anonymous
  };
  teacherResources: {
    curriculumIdeas: boolean;
    classroomTips: boolean;
    educationalResearch: boolean;
    featureUpdates: boolean;
  };
  productAnnouncements: {
    newFeatures: boolean;
    maintenanceUpdates: boolean;
    communityHighlights: boolean;
  };
}

class NewsletterPersonalization {
  async generatePersonalizedContent(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    const children = await this.getUserChildren(userId);
    const recentProgress = await this.getRecentProgress(userId, 30); // last 30 days
    
    const personalizedContent = {
      greeting: `Hi ${user.first_name || 'there'}!`,
      childrenSummary: children.map(child => ({
        name: child.first_name,
        recentSessions: recentProgress.filter(p => p.child_id === child.id).length,
        averageScore: this.calculateAverageScore(recentProgress, child.id),
        strongestCategory: this.getStrongestCategory(recentProgress, child.id),
        improvementArea: this.getImprovementArea(recentProgress, child.id)
      })),
      recommendedActions: this.generateRecommendations(recentProgress),
      celebrationMoments: this.findCelebrationMoments(recentProgress)
    };
    
    return personalizedContent;
  }
  
  async generateMonthlyProgressReport(userId: string): Promise<string> {
    const content = await this.generatePersonalizedContent(userId);
    
    // Generate HTML email content for Beehiiv
    return this.renderEmailTemplate('monthly_progress', content);
  }
}
```

### COPPA-Compliant Email Practices

#### **Child Data Protection in Marketing**
```typescript
class EmailComplianceService {
  async validateEmailSubscription(email: string, userAge?: number): Promise<boolean> {
    // Never collect emails from children under 13
    if (userAge && userAge < 13) {
      throw new Error('Cannot collect email addresses from children under 13');
    }
    
    // Validate email belongs to parent/teacher, not child
    const existingUser = await this.getUserByEmail(email);
    if (existingUser && existingUser.role === 'child') {
      throw new Error('Child accounts cannot subscribe to marketing emails');
    }
    
    return true;
  }
  
  async handleDataDeletionRequest(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    
    if (user.beehiiv_subscriber_id) {
      // Remove from Beehiiv
      await this.beehiivService.unsubscribeUser(user.beehiiv_subscriber_id);
      
      // Remove from our database
      await this.deleteEmailSubscription(userId);
      
      // Log compliance action
      await this.logComplianceAction(userId, 'email_data_deleted');
    }
  }
  
  async auditEmailDataUsage(): Promise<ComplianceReport> {
    const subscriptions = await this.getAllEmailSubscriptions();
    
    const report = {
      totalSubscribers: subscriptions.length,
      childEmailsFound: subscriptions.filter(s => s.user_role === 'child').length, // Should be 0
      parentEmailsActive: subscriptions.filter(s => s.user_role === 'parent' && s.is_active).length,
      teacherEmailsActive: subscriptions.filter(s => s.user_role === 'teacher' && s.is_active).length,
      dataRetentionCompliant: subscriptions.every(s => this.isDataRetentionCompliant(s)),
      lastAuditDate: new Date().toISOString()
    };
    
    if (report.childEmailsFound > 0) {
      await this.alertComplianceViolation('Child emails found in marketing database');
    }
    
    return report;
  }
}
```

---

This comprehensive backend architecture ensures RecallForge can handle elementary school users safely, process AI requests efficiently, manage COPPA-compliant billing through Stripe, and engage parents and teachers through personalized email marketing via Beehiiv, all while scaling from web to mobile applications.