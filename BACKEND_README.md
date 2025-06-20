# RecallForge Backend Implementation

## Overview

RecallForge backend is a comprehensive Supabase-based system designed for COPPA-compliant elementary education. The backend provides secure flashcard management, AI-generated multiple choice questions, and child-safe progress tracking.

## 🏗️ Architecture

### Technology Stack
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with COPPA compliance
- **Storage**: Supabase Storage for CSV files
- **Real-time**: Supabase Real-time for progress updates
- **AI Integration**: OpenAI GPT-4.1 mini (ready for integration)
- **Type Safety**: TypeScript with comprehensive type definitions

### Core Features
- ✅ COPPA-compliant child data protection
- ✅ Row Level Security (RLS) policies
- ✅ Comprehensive database schema
- ✅ RESTful API endpoints
- ✅ File upload and validation
- ✅ Real-time progress tracking
- ✅ Migration system
- ✅ Health monitoring

## 🚀 Quick Start

### Prerequisites
1. Node.js 18+ installed
2. Supabase project created
3. Environment variables configured

### Setup Steps

1. **Clone and install dependencies**:
   ```bash
   git clone <repository>
   cd flashcards
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Run the backend setup**:
   ```bash
   npm run setup
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Environment Variables

Create `.env.local` with the following variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (Optional for AI features)
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (Optional for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Beehiiv Configuration (Optional for email marketing)
BEEHIIV_API_KEY=your_beehiiv_api_key
BEEHIIV_PUBLICATION_ID=your_beehiiv_publication_id
```

## 📊 Database Schema

### Core Tables

#### Users (Parents/Teachers only - COPPA compliant)
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'parent',
  subscription_status subscription_status DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  email_marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### Child Profiles (Minimal data collection)
```sql
child_profiles (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  grade_level INTEGER,
  birth_year INTEGER,
  preferences JSONB DEFAULT '{}'
)
```

#### Decks (Flashcard collections)
```sql
decks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  child_id UUID REFERENCES child_profiles(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  total_questions INTEGER DEFAULT 0,
  processing_status processing_status DEFAULT 'pending'
)
```

#### Questions (AI-generated multiple choice)
```sql
questions (
  id UUID PRIMARY KEY,
  deck_id UUID REFERENCES decks(id),
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  distractor_1 TEXT NOT NULL,
  distractor_2 TEXT NOT NULL,
  distractor_3 TEXT NOT NULL,
  category VARCHAR(100),
  difficulty_level INTEGER DEFAULT 3
)
```

### Complete Schema
See `migrations/001_initial_schema.sql` for the complete database schema.

## 🔐 Security & COPPA Compliance

### Row Level Security Policies
All tables have comprehensive RLS policies ensuring:
- Parents can only access their own children's data
- Teachers can only access their students' data
- No direct child authentication (COPPA compliance)
- Admins have appropriate oversight capabilities

### COPPA Compliance Features
- **No child accounts**: Only parents/teachers can authenticate
- **Minimal data collection**: Limited child information storage
- **Enhanced protections**: Special handling for children under 13
- **Data deletion**: Automated deletion scheduling capabilities
- **Content filtering**: Built-in inappropriate content detection

### Security Functions
```sql
-- Helper functions in private schema
private.get_user_role()
private.is_child_parent(child_id)
private.can_access_child_data(child_id)
private.enforce_coppa_compliance()
```

## 🛠️ API Endpoints

### Authentication
All API endpoints require authentication via Supabase Auth.

### Deck Management
```typescript
GET    /api/decks              // List user's decks
POST   /api/decks              // Create new deck from CSV
GET    /api/decks/[id]         // Get deck details
PUT    /api/decks/[id]         // Update deck
DELETE /api/decks/[id]         // Delete deck
```

### Child Management
```typescript
GET    /api/children           // Get user's children
POST   /api/children           // Create child profile (COPPA-compliant)
```

### Test Sessions
```typescript
POST   /api/sessions           // Start new test session
GET    /api/sessions           // Get recent sessions
POST   /api/sessions/[id]/answer     // Submit answer
POST   /api/sessions/[id]/complete   // Complete session
```

### System Health
```typescript
GET    /api/health             // System health check
```

## 📁 File Upload & Processing

### CSV Upload Flow
1. **Upload validation**: File type, size, and content validation
2. **Content scanning**: Basic inappropriate content detection
3. **Parsing**: CSV structure validation with preview
4. **Storage**: Secure upload to Supabase Storage
5. **Processing**: Queue for AI question generation (future)

### Supported CSV Formats
```csv
question,answer
"What does 'aqua' mean in Latin?","water"
"What does 'terra' mean in Latin?","earth"
```

Alternative column names supported:
- Question: `question`, `q`, `term`, `front`
- Answer: `answer`, `a`, `definition`, `back`

## 🔄 Real-time Features

### WebSocket Connections
```typescript
// Subscribe to deck processing updates
subscribeToJobProgress(jobId, callback);

// Subscribe to test session updates
subscribeToSessionUpdates(sessionId, callback);

// Subscribe to database changes
subscribeToTableChanges('decks', filter, callback);
```

### Child-Friendly Messages
```typescript
REALTIME_MESSAGES = {
  PROCESSING_STARTED: "🚀 Starting to work on your questions...",
  PROCESSING_QUESTIONS: (progress) => `🔍 Working on your questions... ${progress}% done!`,
  PROCESSING_COMPLETE: "🎉 All done! Your questions are ready to practice!"
}
```

## 🧪 Development Commands

```bash
# Setup and health
npm run setup              # Complete backend setup
npm run setup:health       # Check system health

# Database operations
npm run db:migrate          # Run pending migrations
npm run db:validate         # Validate database schema

# Development
npm run dev                # Start development server
npm run build              # Build for production
npm run type-check         # TypeScript validation
npm run lint               # ESLint checking
```

## 📊 Monitoring & Health Checks

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T12:00:00Z",
  "checks": {
    "database": { "healthy": true, "responseTime": 45 },
    "auth": { "healthy": true, "responseTime": 23 },
    "overall": { "healthy": true, "responseTime": 68 }
  },
  "uptime": 3600,
  "environment": "development"
}
```

### Performance Monitoring
- Database query performance tracking
- API response time monitoring
- Real-time connection status
- File upload success rates

## 🔧 Migration System

### Running Migrations
```bash
npm run db:migrate          # Run all pending migrations
npm run db:validate         # Validate current schema
```

### Migration Files
- `001_initial_schema.sql` - Core database schema
- `002_row_level_security.sql` - RLS policies and security functions

### Creating New Migrations
1. Create new file: `migrations/003_your_migration.sql`
2. Follow existing patterns for transactions and error handling
3. Test thoroughly before deploying

## 🎯 Subscription Limits

### Free Tier
- 5 decks maximum
- 1 child profile
- Basic analytics
- Web access only

### Individual Plan
- Unlimited decks
- 1 child profile
- Basic analytics
- Web + mobile access

### Family Plan
- Unlimited decks
- Up to 5 children
- Advanced analytics
- Priority support
- Export features

### Educator Plan
- Unlimited decks
- Up to 30 students
- Classroom management
- Bulk operations
- Education specialist support

## 🚨 Error Handling

### Child-Friendly Error Messages
All error responses include child-friendly messages:

```typescript
{
  error: {
    code: "DECK_PROCESSING_FAILED",
    message: "AI processing failed for deck creation",
    childFriendlyMessage: "Oops! We're having trouble with your questions. Let's try again!",
    recoveryActions: ["Try uploading the file again", "Check if your CSV file is formatted correctly"]
  }
}
```

## 🔮 Future Enhancements

### AI Integration (Ready for Implementation)
- OpenAI GPT-4.1 mini integration for distractor generation
- Batch processing system for large CSV files
- Content categorization and difficulty assessment
- Cost optimization with caching strategies

### Payment Processing (Stripe Integration Ready)
- Subscription management
- Usage-based billing
- Educational pricing
- Family plan management

### Email Marketing (Beehiiv Integration Ready)
- Newsletter subscriptions
- Progress reports
- Educational content delivery
- Parent engagement campaigns

## 📝 Contributing

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Comprehensive type definitions

### Security Guidelines
- Always use parameterized queries
- Implement proper input validation
- Follow COPPA compliance guidelines
- Test all RLS policies thoroughly

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Security tests for RLS policies
- Load testing for performance validation

## 📞 Support

For setup issues or questions:
1. Check the health endpoint: `/api/health`
2. Review environment variables
3. Validate database schema: `npm run db:validate`
4. Check Supabase project configuration

## 📜 License

This project is part of RecallForge and follows the main project's licensing terms.