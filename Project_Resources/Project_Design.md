# RecallForge Project Design Document
## Complete User Experience & Technical Specification

### Executive Summary

RecallForge transforms CSV flashcards into AI-generated multiple choice tests specifically designed for elementary school students. Built with 9-year-old Lilly as our primary user, every design decision prioritizes child-friendly interfaces, learning engagement, and academic success while ensuring COPPA compliance and parent oversight.

**Mission**: Make Latin vocabulary mastery feel like an adventure, not a chore.

**Success Metrics**:
- 85%+ question accuracy improvement over 4 weeks
- 12+ minute average session duration
- 5+ days per week usage consistency
- 90%+ parent satisfaction with progress visibility

---

## Project Overview & Architecture

### Technology Stack
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Integration**: OpenAI GPT-4.1 mini with custom proxy
- **Deployment**: Cloudflare Pages + Workers
- **Monitoring**: Sentry for error tracking
- **Analytics**: Custom learning analytics dashboard

### Target User Personas

#### Primary User: Lilly (9-year-old)
- **Device**: Shared family iPad
- **Attention Span**: 10-15 minutes focused learning
- **Reading Level**: 4th grade, above average
- **Motivation**: Stars, badges, immediate positive feedback
- **Frustrations**: Boring interfaces, complex navigation, harsh error messages

#### Secondary User: Sarah (Parent)
- **Role**: Content manager, progress monitor
- **Needs**: CSV upload, progress tracking, time controls
- **Concerns**: Screen time limits, educational value, child safety
- **Tech Level**: Moderate comfort with web applications

#### Tertiary User: Mrs. Rodriguez (Teacher)
- **Role**: Curriculum alignment, class progress oversight
- **Needs**: Bulk upload, analytics dashboard, student engagement data
- **Integration**: Existing lesson plans and assessment cycles

---

## Complete User Journey Analysis

### Lilly's Primary Learning Journey

#### Discovery & Onboarding (First Session)
```
Parent Research → Account Creation → Child Profile Setup → 
First CSV Upload → AI Processing Wait → Welcome Tutorial → 
First Practice Session → Success Celebration → Habit Formation
```

**Emotional Arc**: Curiosity → Anticipation → Delight → Confidence → Routine

#### Typical Learning Session (10-15 minutes)
```
Login/Child Selection → Dashboard View → Deck Selection → 
Pre-Test Motivation → Question Sequence → Real-time Feedback → 
Session Summary → Achievement Recognition → Next Session Tease
```

**Engagement Touchpoints**:
- Welcome back message with child's name
- Progress visualization showing improvement
- Immediate positive feedback on correct answers
- Gentle encouragement on incorrect answers
- Celebration animations for milestones

#### Long-term Progression (4+ weeks)
```
Initial Exploration → Habit Formation → Skill Building → 
Confidence Growth → Academic Improvement → Peer Recognition
```

---

## Detailed Page Specifications

### 1. Authentication Flow

#### Sign-In Page (`/auth/signin`)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│     RecallForge Logo (120px)        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     Welcome Back!           │    │
│  │                             │    │
│  │  Email: [____________]      │    │
│  │  Password: [_________]      │    │
│  │                             │    │
│  │    [Sign In Button]         │    │
│  │                             │    │
│  │    New to RecallForge?      │    │
│  │    [Create Account]         │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Design Specifications**:
- **Background**: Soft gradient from `#FAFBFC` to `#F5F7FA`
- **Main Card**: White background, 24px border radius, subtle shadow
- **Logo**: 120px width, centered, RecallForge brand colors
- **Form Elements**: Large touch targets (48px height minimum)
- **Button**: Primary blue gradient, 16px padding, friendly rounded corners
- **Typography**: Comic Neue font, high contrast text

**Interaction Details**:
- **Loading State**: Spinner with "Getting ready for your adventure!"
- **Error States**: Gentle messages like "Let's try that again!"
- **Success**: Smooth transition to dashboard with welcome animation

**Technical Implementation**:
```typescript
interface SignInPageProps {
  onSuccess: (user: User) => void;
  onError: (error: AuthError) => void;
}

// Form validation
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Child-friendly error messages
const errorMessages = {
  invalid_credentials: "Let's double-check that email and password!",
  too_many_attempts: "Let's take a quick break and try again in a few minutes.",
  network_error: "Having trouble connecting. Let's try again!"
};
```

#### Account Creation (`/auth/signup`)

**Additional Fields for Child Safety**:
- Parent/guardian name and relationship
- Child's grade level and birth year
- Parental consent checkbox (COPPA compliance)
- Email verification requirement

### 2. Child Profile Selection (`/select-child`)

**Purpose**: Multi-child family support with visual child selection

**Layout Structure**:
```
┌─────────────────────────────────────┐
│          Choose Your Learner        │
│                                     │
│  ┌─────┐    ┌─────┐    ┌─────┐     │
│  │ 👧  │    │ 👦  │    │  +  │     │
│  │Lilly│    │ Max │    │ Add │     │
│  │ 4th │    │ 3rd │    │Child│     │
│  └─────┘    └─────┘    └─────┘     │
│                                     │
│     [Continue as Parent/Teacher]    │
└─────────────────────────────────────┘
```

**Design Specifications**:
- **Child Cards**: 150px × 180px, rounded corners, soft shadows
- **Avatar**: Child-friendly illustrations (not photos for privacy)
- **Grade Display**: Clear, large text below name
- **Add Child**: Dashed border, welcoming "+" icon
- **Accessibility**: High contrast, keyboard navigable
- **Animation**: Gentle hover effects, selection confirmation

### 3. Home Dashboard (`/dashboard`)

**Primary Interface for Deck Management and Progress Overview**

#### Layout Structure (Desktop/Tablet)
```
┌─────────────────────────────────────────────────────────────┐
│ RecallForge    👧 Lilly    🏆 125 pts    ⚙️ Settings     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Good morning, Lilly! Ready for today's adventure? 🌟     │
│                                                             │
│  ┌─── My Learning Decks ──────────────────┐  ┌─Progress─┐ │
│  │                                         │  │         │ │
│  │  ┌─────────────┐  ┌─────────────┐     │  │ ░░░░░░░ │ │
│  │  │   Latin     │  │  Animals    │     │  │ ░░░░░░░ │ │
│  │  │ Vocabulary  │  │    &        │     │  │ ░░░░░░░ │ │
│  │  │             │  │  Plants     │     │  │         │ │
│  │  │ 25 words    │  │ 18 words    │     │  └─────────┘ │
│  │  │ Last: 85%   │  │ Last: 92%   │     │             │ │
│  │  └─────────────┘  └─────────────┘     │  Recent:    │ │
│  │                                         │  • 5 days   │ │
│  │  ┌─────────────┐  ┌─────────────┐     │  • 127 ?s   │ │
│  │  │   Family    │  │     +       │     │  • 89% avg  │ │
│  │  │    Words    │  │   Upload    │     │             │ │
│  │  │             │  │   New CSV   │     │             │ │
│  │  │ 32 words    │  │    File     │     │             │ │
│  │  │ Last: 78%   │  │             │     │             │ │
│  │  └─────────────┘  └─────────────┘     │             │ │
│  └─────────────────────────────────────────┘             │ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Design Specifications

**Header Navigation**:
- **Logo**: 80px width, left-aligned
- **Child Indicator**: Avatar + name, center-left
- **Points Display**: Gamified score, center-right  
- **Settings**: Gear icon, right-aligned
- **Height**: 72px total, 24px padding

**Welcome Section**:
- **Greeting**: Personalized with time of day and child's name
- **Motivation**: Encouraging message with emoji
- **Background**: Subtle gradient or pattern
- **Typography**: Large, friendly heading (28px)

**Deck Grid**:
- **Layout**: 2×2 grid on tablet, 1×2 on mobile
- **Card Size**: 280px × 220px minimum
- **Spacing**: 24px gaps between cards
- **Responsive**: Flexible grid system

**Individual Deck Cards**:
```typescript
interface DeckCard {
  id: string;
  name: string;
  totalQuestions: number;
  lastScore?: number;
  lastAttemptDate?: Date;
  progress: number; // 0-100
  difficulty: 'easy' | 'medium' | 'hard';
  categories: string[];
  isProcessing?: boolean;
}
```

**Card Design**:
- **Background**: White with subtle border
- **Border Radius**: 16px for child-friendly curves
- **Shadow**: Soft drop shadow (`0 4px 16px rgba(0,0,0,0.1)`)
- **Hover Effect**: Lift animation (`translateY(-4px)`)
- **Loading State**: Skeleton loader for processing decks

**Upload Card (Special)**:
- **Visual**: Dashed border, upload icon, encouraging text
- **Interaction**: Click to open file picker or drag-and-drop
- **Feedback**: Immediate visual confirmation of file selection
- **Progress**: Real-time upload and processing status

#### Mobile Layout Adaptations
```
┌─────────────────────┐
│ 🏠 Lilly    🏆 125  │
├─────────────────────┤
│                     │
│ Ready for today's   │
│ Latin adventure? 🌟 │
│                     │
│ ┌─────────────────┐ │
│ │   Latin Vocab   │ │
│ │   25 words      │ │
│ │   Last: 85%     │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   Animals &     │ │
│ │   Plants        │ │
│ │   18 words      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │      + Add      │ │
│ │    New Deck     │ │
│ └─────────────────┘ │
└─────────────────────┘
```

**Mobile Specifications**:
- **Single Column**: Stacked card layout
- **Card Height**: Reduced to 160px
- **Touch Targets**: Minimum 44px for all interactive elements
- **Swipe Navigation**: Optional swipe between decks
- **Pull-to-Refresh**: Standard mobile pattern

#### Interaction Specifications

**Deck Selection Flow**:
1. **Card Tap/Click**: Visual feedback (scale animation)
2. **Loading State**: "Getting your questions ready..."
3. **Transition**: Smooth slide to deck detail page
4. **Back Navigation**: Clear return path to dashboard

**Upload Interaction**:
1. **File Selection**: Drag-and-drop or click to browse
2. **Validation**: Immediate feedback on file format
3. **Preview**: Show first few rows of CSV data
4. **Confirmation**: "Create deck" button with file name
5. **Processing**: Real-time progress with encouraging messages

### 4. CSV Upload Flow (`/upload`)

**Multi-Step Process for Deck Creation**

#### Step 1: File Selection
```
┌─────────────────────────────────────┐
│          Create New Deck            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     📁 Choose Your CSV      │    │
│  │                             │    │
│  │   Drag & drop your file     │    │
│  │            or               │    │
│  │      [Browse Files]         │    │
│  │                             │    │
│  │  Supported: .csv files      │    │
│  │  Max size: 10MB             │    │
│  └─────────────────────────────┘    │
│                                     │
│         [Back] [Continue]           │
└─────────────────────────────────────┘
```

#### Step 2: Column Mapping
```
┌─────────────────────────────────────┐
│        Review Your Questions        │
│                                     │
│  Question Column: [Dropdown ▼]     │
│  Answer Column:   [Dropdown ▼]     │
│                                     │
│  Preview:                           │
│  ┌─────────────────────────────┐    │
│  │ Q: What does "aqua" mean?   │    │
│  │ A: water                    │    │
│  │                             │    │
│  │ Q: What does "casa" mean?   │    │
│  │ A: house                    │    │
│  └─────────────────────────────┘    │
│                                     │
│  Found 25 questions ✅             │
│                                     │
│         [Back] [Create Deck]        │
└─────────────────────────────────────┘
```

#### Step 3: Deck Customization
```
┌─────────────────────────────────────┐
│         Customize Your Deck         │
│                                     │
│  Deck Name: [________________]      │
│                                     │
│  Description (optional):            │
│  [_________________________]       │
│  [_________________________]       │
│                                     │
│  For: [Lilly ▼] (child selection)  │
│                                     │
│  Subject: [Latin ▼]                │
│                                     │
│         [Back] [Create Deck]        │
└─────────────────────────────────────┘
```

#### Step 4: AI Processing Status
```
┌─────────────────────────────────────┐
│     Creating Your Learning Deck     │
│                                     │
│         🤖 Working hard!            │
│                                     │
│  ████████████░░░░ 75%              │
│                                     │
│  Making practice questions fun...   │
│                                     │
│  ✅ Reading your questions          │
│  ✅ Creating answer choices         │
│  🔄 Organizing by topic            │
│  ⏳ Almost done!                   │
│                                     │
│    This usually takes 2-3 minutes   │
└─────────────────────────────────────┘
```

**Processing Messages by Stage**:
- **0-25%**: "Reading your questions..."  
- **25-50%**: "Creating answer choices..."
- **50-75%**: "Organizing by topic..."
- **75-90%**: "Adding the finishing touches..."
- **90-100%**: "Almost ready for you!"

#### Technical Implementation

```typescript
interface UploadState {
  step: 'file' | 'mapping' | 'customize' | 'processing' | 'complete';
  file?: File;
  preview?: CSVRow[];
  mapping?: {
    questionColumn: string;
    answerColumn: string;
  };
  deckConfig?: {
    name: string;
    description?: string;
    childId: string;
    subject: string;
  };
  processingJobId?: string;
  progress: number;
}

// Real-time processing updates
const useProcessingStatus = (jobId: string) => {
  const [status, setStatus] = useState<ProcessingStatus>();
  
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/processing/${jobId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setStatus(update);
    };
    
    return () => ws.close();
  }, [jobId]);
  
  return status;
};
```

### 5. Deck Detail Page (`/deck/[id]`)

**Comprehensive Deck Information and Action Center**

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard      Latin Vocabulary      ⚙️ Settings  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── Deck Overview ─────────────────┐  ┌─── Quick Stats ──┐│
│  │                                   │  │                  ││
│  │  📚 Latin Vocabulary              │  │  Total: 25 words ││
│  │  Created: March 15, 2024          │  │  Practiced: 20   ││
│  │                                   │  │  Mastered: 15    ││
│  │  Your progress is amazing! You've │  │                  ││
│  │  improved 23% this week! 🌟       │  │  Last Score:     ││
│  │                                   │  │     85% ⭐⭐⭐     ││
│  │  ┌─────────────────────────────┐  │  │                  ││
│  │  │      [Start Practice]       │  │  │  Streak: 5 days  ││
│  │  └─────────────────────────────┘  │  │     🔥🔥🔥🔥🔥    ││
│  │                                   │  │                  ││
│  └───────────────────────────────────┘  └──────────────────┘│
│                                                             │
│  ┌─── Progress by Topic ──────────────────────────────────┐ │
│  │                                                        │ │
│  │  Animals & Nature     ████████░░ 80%  (8/10 correct)  │ │
│  │  Family & People      ██████░░░░ 60%  (6/10 correct)  │ │
│  │  Food & Drink         ██████████ 100% (5/5 correct)   │ │
│  │  Common Verbs         ████░░░░░░ 40%  (2/5 correct)   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── Recent Sessions ─────────────────────────────────────┐│
│  │                                                         ││
│  │  Today, 3:45 PM      Practice  →  85% (17/20) ⭐⭐⭐    ││
│  │  Yesterday, 4:12 PM  Practice  →  78% (15/19) ⭐⭐     ││
│  │  March 18, 3:30 PM   Test     →  92% (23/25) ⭐⭐⭐⭐   ││
│  │                                                         ││
│  │                                    [View All History]   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

#### Design Specifications

**Header Section**:
- **Navigation**: Clear back button with "Back to Dashboard" text
- **Deck Title**: Large, prominent display (24px font)
- **Settings**: Gear icon for deck management options

**Overview Panel**:
- **Deck Info**: Name, creation date, child assignment
- **Encouragement**: Personalized progress message
- **Primary CTA**: Large "Start Practice" button (minimum 280px wide)
- **Visual Design**: Card with soft shadow, rounded corners

**Quick Stats Panel**:
- **Key Metrics**: Total words, progress counts, recent score
- **Streak Display**: Visual fire emojis for consecutive days
- **Achievement Level**: Star rating system
- **Color Coding**: Green for good performance, blue for neutral

**Progress by Topic**:
- **Visual Bars**: Animated progress bars with percentages
- **Category Labels**: Clear topic names from AI categorization
- **Performance Data**: Fraction and percentage display
- **Actionable**: Click topic to practice specific category

#### Interaction Specifications

**Start Practice Button**:
```typescript
interface PracticeOptions {
  mode: 'practice' | 'test' | 'review';
  questionCount?: number;
  categories?: string[];
  timeLimit?: number;
}

const handleStartPractice = async (options: PracticeOptions) => {
  // Show loading state
  setLoading(true);
  
  // Generate session
  const session = await createSession({
    deckId,
    childId,
    ...options
  });
  
  // Navigate to practice interface
  router.push(`/practice/${session.id}`);
};
```

**Progress Bar Interactions**:
- **Hover**: Show detailed breakdown tooltip
- **Click**: Navigate to category-specific practice
- **Animation**: Smooth fill animation on page load

### 6. Practice Interface (`/practice/[sessionId]`)

**Core Learning Experience - The Heart of RecallForge**

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Question 3 of 10    ████████░░░░░░░░░░ 30%        ⏱️ 08:45 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     Latin Vocabulary                        │
│                    Animals & Nature                         │
│                                                             │
│              What does "canis" mean in English?             │
│                                                             │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │         A.          │    │         B.          │      │
│    │        dog          │    │        cat          │      │
│    │                     │    │                     │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │         C.          │    │         D.          │      │
│    │       horse         │    │       bird          │      │
│    │                     │    │                     │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
│                                                             │
│                    [Skip Question]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Design Specifications

**Progress Header**:
- **Question Counter**: "Question X of Y" (18px font)
- **Progress Bar**: Animated, shows completion percentage
- **Timer**: Optional countdown (can be disabled)
- **Background**: Light background bar, colored fill

**Question Area**:
- **Subject/Category**: Small label above question
- **Question Text**: Large, clear typography (24px minimum)
- **Spacing**: Generous white space around question
- **Max Width**: 600px for optimal reading

**Answer Options**:
- **Layout**: 2×2 grid on larger screens, stacked on mobile
- **Size**: Minimum 200px × 100px per option
- **Typography**: 18px text, centered
- **Touch Targets**: Minimum 44px touch area
- **Hover State**: Subtle scale and shadow animation

**Option States**:
```css
/* Default state */
.answer-option {
  background: #FFFFFF;
  border: 2px solid #E1E5E9;
  border-radius: 12px;
  transition: all 0.2s ease;
}

/* Hover state */
.answer-option:hover {
  border-color: #4A90E2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

/* Selected state */
.answer-option.selected {
  border-color: #4A90E2;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: #FFFFFF;
}

/* Correct answer (after submission) */
.answer-option.correct {
  border-color: #7ED321;
  background: linear-gradient(135deg, #7ED321 0%, #5CB85C 100%);
  color: #FFFFFF;
}

/* Incorrect answer (after submission) */
.answer-option.incorrect {
  border-color: #FF5252;
  background: #FFE5E5;
  color: #FF5252;
}
```

#### Feedback States

**Immediate Feedback (After Answer Selection)**:
```
┌─────────────────────────────────────────────────────────────┐
│                    🎉 Excellent work!                       │
│                                                             │
│              What does "canis" mean in English?             │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │    ✅ A. dog        │    │      B. cat         │      │
│    │     (CORRECT)       │    │                     │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │      C. horse       │    │      D. bird        │      │
│    │                     │    │                     │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
│              "Canis" is Latin for dog! 🐕                  │
│                                                             │
│                      [Next Question]                        │
└─────────────────────────────────────────────────────────────┘
```

**Incorrect Answer Feedback**:
```
┌─────────────────────────────────────────────────────────────┐
│                  Good try! Let's learn! 💪                  │
│                                                             │
│              What does "canis" mean in English?             │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │    ✅ A. dog        │    │   ❌ B. cat         │      │
│    │     (CORRECT)       │    │   (YOUR CHOICE)     │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │      C. horse       │    │      D. bird        │      │
│    │                     │    │                     │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
│          That's okay! "Canis" means dog in Latin. 🐕        │
│              You're getting stronger every try!            │
│                                                             │
│                      [Next Question]                        │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Optimizations

**Vertical Layout for Small Screens**:
```
┌─────────────────────┐
│ 3/10  ████░░░░░░░░  │
├─────────────────────┤
│                     │
│ What does "canis"   │
│ mean in English?    │
│                     │
│ ┌─────────────────┐ │
│ │    A. dog       │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │    B. cat       │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   C. horse      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   D. bird       │ │
│ └─────────────────┘ │
│                     │
│    [Skip Question]  │
└─────────────────────┘
```

### 7. Session Results (`/results/[sessionId]`)

**Celebration and Learning Summary**

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    🌟 Amazing Work, Lilly! 🌟               │
│                                                             │
│                    ┌─────────────────┐                     │
│                    │       85%       │                     │
│                    │   ⭐⭐⭐⭐⭐      │                     │
│                    │                 │                     │
│                    │   17 out of     │                     │
│                    │   20 correct    │                     │
│                    └─────────────────┘                     │
│                                                             │
│  ┌─── Your Progress ─────────────────────────────────────┐ │
│  │                                                       │ │
│  │  Animals & Nature:    ████████░░ 4/5 correct (80%)   │ │
│  │  Family & People:     ██████░░░░ 3/5 correct (60%)   │ │
│  │  Food & Drink:        ██████████ 5/5 correct (100%)  │ │
│  │  Common Verbs:        ██████████ 5/5 correct (100%)  │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── New Achievements ──────────────────────────────────┐ │
│  │                                                       │ │
│  │  🏆 Perfect Score Hero! (5 in a row correct)         │ │
│  │  🔥 Daily Streak Master! (5 days in a row)           │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│    [Practice Again] [Try Different Deck] [View Progress]   │
│                                                             │
│                      [Back to Dashboard]                    │
└─────────────────────────────────────────────────────────────┘
```

#### Celebration Animations

**Score Reveal Animation**:
1. **Fade In**: Results container slides up from bottom
2. **Number Count**: Score animates from 0 to final percentage
3. **Star Fill**: Stars fill one by one with sparkle effect
4. **Achievement Pop**: New badges appear with bounce animation
5. **Confetti**: Brief confetti animation for scores >80%

**Celebration Messages by Performance**:
```typescript
const getCelebrationMessage = (score: number, childName: string) => {
  if (score >= 95) return `🌟 Perfect! ${childName}, you're unstoppable!`;
  if (score >= 85) return `🎉 Excellent work, ${childName}!`;
  if (score >= 75) return `⭐ Great job, ${childName}!`;
  if (score >= 65) return `👏 Nice work, ${childName}!`;
  return `💪 Good effort, ${childName}! You're getting stronger!`;
};
```

### 8. Parent Dashboard (`/parent/dashboard`)

**Adult Interface for Content Management and Progress Monitoring**

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ RecallForge Parent Portal    👤 Sarah Thompson    🔧 Account │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── Children Overview ──────────────────────────────────┐ │
│  │                                                        │ │
│  │  👧 Lilly (4th Grade)              👦 Max (3rd Grade) │ │
│  │  • Latin Vocabulary: 85% avg       • Math Facts: 92%  │ │
│  │  • 5-day streak 🔥                 • 3-day streak     │ │
│  │  • Last session: Today 3:45 PM     • Last: Yesterday  │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── Quick Actions ──────────────────────────────────────┐ │
│  │                                                        │ │
│  │  📤 Upload New CSV    📊 View Reports    ⚙️ Settings   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── Recent Activity ────────────────────────────────────┐ │
│  │                                                        │ │
│  │  Today 3:45 PM   Lilly completed Latin practice (85%) │ │
│  │  Today 11:30 AM  New deck "Animals" finished processing│ │
│  │  Yesterday 4:12  Lilly completed Latin practice (78%) │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─── Weekly Summary ─────────────────────────────────────┐ │
│  │                                                        │ │
│  │  This Week:                                            │ │
│  │  • Total practice time: 78 minutes                    │ │
│  │  • Questions answered: 127                            │ │
│  │  • Average accuracy: 83%                              │ │
│  │  • Improvement: +12% from last week 📈               │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 9. Subscription & Billing Flows

**COPPA-Compliant Payment Processing with Child-Safe Design**

#### Subscription Plans Overview
```typescript
interface SubscriptionPlan {
  id: 'free' | 'family' | 'educator' | 'enterprise';
  name: string;
  price: number; // monthly in cents
  features: string[];
  limits: {
    maxDecks: number;
    maxChildren: number;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  };
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    features: ['5 flashcard decks', 'Basic progress tracking', '1 child profile'],
    limits: { maxDecks: 5, maxChildren: 1, advancedAnalytics: false, prioritySupport: false }
  },
  {
    id: 'individual',
    name: 'Individual Plan',
    price: 500, // $5.00/month
    features: ['Unlimited decks', 'Basic analytics', '1 child profile', 'AI question generation', 'Web access'],
    limits: { maxDecks: -1, maxChildren: 1, advancedAnalytics: false, prioritySupport: false }
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: 1299, // $12.99/month
    features: ['Unlimited decks', 'Advanced analytics', 'Up to 5 children', 'Priority support', 'Mobile app access', 'Export progress reports'],
    limits: { maxDecks: -1, maxChildren: 5, advancedAnalytics: true, prioritySupport: true }
  },
  {
    id: 'educator',
    name: 'Educator Plan',
    price: 2499, // $24.99/month
    features: ['Unlimited decks', 'Classroom management dashboard', 'Up to 30 students', 'Bulk CSV upload tools', 'Detailed student analytics', 'Curriculum alignment tools', 'Priority support with education specialist'],
    limits: { maxDecks: -1, maxChildren: 30, advancedAnalytics: true, prioritySupport: true }
  }
];
```

#### Subscription Selection Page (`/pricing`)

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│              Choose Your Learning Plan                      │
│          Perfect for Your Family's Needs                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─Free Trial─┐  ┌─Individual─┐  ┌─── Family Plan ───┐  ┌─Educator─┐ │
│  │            │  │           │  │    MOST POPULAR    │  │          │ │
│  │    Free    │  │ $5.00/mo  │  │     $12.99/mo      │  │ $24.99/mo│ │
│  │ 14 days    │  │           │  │                    │  │          │ │
│  │            │  │ ✓ Unlimited│  │ ✓ Unlimited decks  │  │ ✓ 30 kids│ │
│  │ ✓ 5 decks  │  │   decks   │  │ ✓ 5 children       │  │ ✓ Reports│ │
│  │ ✓ 1 child  │  │ ✓ 1 child │  │ ✓ Advanced reports │  │ ✓ Bulk   │ │
│  │ ✓ Basic    │  │ ✓ Basic   │  │ ✓ Priority support │  │   uploads│ │
│  │   tracking │  │   analytics│  │ ✓ Mobile app       │  │ ✓ Class  │ │
│  │            │  │           │  │                    │  │   mgmt   │ │
│  │[Start Free]│  │ [Choose]  │  │ [Choose Family]    │  │ [Choose] │ │
│  └────────────┘  └───────────┘  └────────────────────┘  └──────────┘ │
│                                                             │
│             👨‍👩‍👧‍👦 Perfect for homeschool families            │
│                  🏫 Designed for classroom use              │
└─────────────────────────────────────────────────────────────┘
```

**Design Specifications**:
- **Parent-Focused**: Clear value proposition for family education
- **Child Safety**: No marketing directed at children
- **Educational Pricing**: Transparent, fair pricing for families
- **Trial Emphasis**: 14-day free trial prominently featured

#### Payment Flow (`/checkout`)

**Step-by-Step Checkout Process**:

**Step 1: Plan Confirmation**
```
┌─────────────────────────────────────────────────────────────┐
│                    Confirm Your Plan                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Selected Plan: Family Plan ($12.99/month)                 │
│                                                             │
│  ✓ Unlimited flashcard decks                               │
│  ✓ Advanced learning analytics                             │
│  ✓ Up to 5 children profiles                              │
│  ✓ Priority customer support                               │
│                                                             │
│  Your 14-day free trial starts today!                      │
│  You won't be charged until [Date]                         │
│                                                             │
│         [Continue to Payment] [Change Plan]                │
└─────────────────────────────────────────────────────────────┘
```

**Step 2: Stripe Payment Form**
```
┌─────────────────────────────────────────────────────────────┐
│                   Payment Information                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Parent/Guardian Name: [_________________]                  │
│                                                             │
│  Email: [_________________________]                        │
│                                                             │
│  ┌─── Payment Details (Secure) ────────────────────────┐   │
│  │                                                     │   │
│  │  Card Number:    [____-____-____-____]             │   │
│  │  Expiry:         [__/__]  Security: [___]          │   │
│  │  Name on Card:   [________________________]        │   │
│  │                                                     │   │
│  │  Billing Address: [_______________________]        │   │
│  │  City: [__________] State: [__] Zip: [_____]       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  □ I agree to the Terms of Service and Privacy Policy      │
│  □ I consent to email updates about my child's progress    │
│                                                             │
│              [Complete Subscription Setup]                  │
│                                                             │
│  🔒 Secured by Stripe • Your information is protected      │
└─────────────────────────────────────────────────────────────┘
```

**Step 3: Subscription Confirmation**
```
┌─────────────────────────────────────────────────────────────┐
│                🎉 Welcome to RecallForge! 🎉                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           Your Family Plan is now active!                  │
│                                                             │
│  ✓ 14-day free trial started                              │
│  ✓ Access to all premium features                         │
│  ✓ Welcome email sent with getting started guide         │
│                                                             │
│              What happens next?                             │
│                                                             │
│  1. 📤 Upload your first CSV file                          │
│  2. 👧 Create profiles for your children                   │
│  3. 🎯 Start your first practice session                   │
│                                                             │
│           [Go to Dashboard] [Upload CSV Now]               │
│                                                             │
│     Questions? Our support team is here to help!           │
└─────────────────────────────────────────────────────────────┘
```

#### Subscription Management (`/account/billing`)

**Parent Billing Dashboard**:
```
┌─────────────────────────────────────────────────────────────┐
│             Account & Billing Management                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── Current Plan ─────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Family Plan - $12.99/month                         │  │
│  │  Next billing: March 15, 2024                       │  │
│  │  Status: Active                                      │  │
│  │                                                      │  │
│  │  Using: 3 of 5 children • 12 decks created          │  │
│  │                                                      │  │
│  │     [Change Plan] [Update Payment] [Cancel]         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── Billing History ─────────────────────────────────┐   │
│  │                                                     │   │
│  │  March 1, 2024    $12.99    ✅ Paid               │   │
│  │  Feb 1, 2024      $12.99    ✅ Paid               │   │
│  │  Jan 1, 2024      $12.99    ✅ Paid               │   │
│  │                                                     │   │
│  │                           [Download Invoices]      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ⚠️  Need to cancel? We're here to help make it work!      │
│      [Contact Support Before Canceling]                    │
└─────────────────────────────────────────────────────────────┘
```

#### Usage Limit Notifications

**Approaching Limits (Gentle Warning)**:
```
┌─────────────────────────────────────────────────────────────┐
│                     Friendly Reminder                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           You're doing great with RecallForge! 🌟          │
│                                                             │
│  You've created 4 of your 5 included flashcard decks.     │
│  Your kids are clearly loving the learning adventure!      │
│                                                             │
│  When you're ready for unlimited decks and advanced        │
│  features, consider upgrading to our Family Plan.          │
│                                                             │
│           [View Plans] [Continue with Free]                │
│                                                             │
│      No pressure - you can upgrade anytime! 😊            │
└─────────────────────────────────────────────────────────────┘
```

**Limit Reached (Upgrade Encouragement)**:
```
┌─────────────────────────────────────────────────────────────┐
│              Ready for Unlimited Learning?                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Wow! You've created all 5 decks in your free plan.       │
│  Your family is clearly loving RecallForge! 🎉            │
│                                                             │
│  Upgrade to Family Plan to unlock:                         │
│  ✓ Unlimited flashcard decks                              │
│  ✓ Advanced progress analytics                             │
│  ✓ Support for up to 5 children                           │
│  ✓ Priority customer support                               │
│                                                             │
│             [Upgrade Now - $12.99/month]                   │
│                                                             │
│    Still want to try free? Delete a deck to create new ones │
│                      [Manage Decks]                         │
└─────────────────────────────────────────────────────────────┘
```

### 10. Email Collection & Newsletter Signup

**Beehiiv Integration for Parent Communication**

#### Footer Email Signup
```
┌─────────────────────────────────────────────────────────────┐
│                    RecallForge Footer                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── Stay Connected ──────────────────────────────────────┐│
│  │                                                         ││
│  │    📧 Get weekly tips to boost your child's learning    ││
│  │                                                         ││
│  │    Email: [_____________________] [Subscribe] 📬       ││
│  │                                                         ││
│  │    ✓ Learning tips from education experts               ││
│  │    ✓ RecallForge feature updates                       ││
│  │    ✓ Success stories from other families               ││
│  │                                                         ││
│  │         No spam • Unsubscribe anytime                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Company • About • Privacy • Support • Contact             │
└─────────────────────────────────────────────────────────────┘
```

#### Newsletter Subscription Confirmation
```
┌─────────────────────────────────────────────────────────────┐
│                 📬 Subscription Confirmed!                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           Thank you for joining our community!              │
│                                                             │
│  You'll receive weekly emails with:                        │
│  • Tips to maximize your child's learning                  │
│  • New RecallForge features and updates                    │
│  • Success stories from other families                     │
│                                                             │
│           Your first email is on its way! 📧               │
│                                                             │
│              [Continue to Dashboard]                        │
│                                                             │
│       Want to update preferences? Visit your account       │
└─────────────────────────────────────────────────────────────┘
```

#### Email Preferences (`/account/preferences`)
```
┌─────────────────────────────────────────────────────────────┐
│                 Email Preferences                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ☑️ Weekly Learning Tips                                   │
│      Receive expert advice on helping your child learn     │
│                                                             │
│  ☑️ Progress Updates                                       │
│      Monthly summary of your child's learning progress     │
│                                                             │
│  ☑️ Product Updates                                        │
│      New features and improvements to RecallForge          │
│                                                             │
│  ☐ Success Stories                                         │
│      Anonymous highlights from other families              │
│                                                             │
│  ☐ Educational Research                                    │
│      Latest findings in elementary education               │
│                                                             │
│              [Save Preferences]                             │
│                                                             │
│  📧 Email: sarah@example.com [Change Email]                │
│                                                             │
│          [Unsubscribe from All] (We'd hate to see you go!) │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation Specifications

### Component Architecture

#### Core Component Library
```typescript
// Design System Components
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

// Button Component
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) => {
  const baseClasses = "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size])}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

// Card Component for Consistent Layout
export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-100 p-6",
        hoverable && "hover:shadow-xl hover:-translate-y-1 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### State Management Strategy

#### Zustand Store Architecture
```typescript
interface AppState {
  // Authentication
  user: User | null;
  selectedChild: ChildProfile | null;
  
  // Decks
  decks: Deck[];
  currentDeck: Deck | null;
  
  // Session Management
  currentSession: TestSession | null;
  sessionProgress: SessionProgress;
  
  // UI State
  loading: {[key: string]: boolean};
  errors: {[key: string]: string | null};
  notifications: Notification[];
}

interface AppActions {
  // Authentication
  setUser: (user: User | null) => void;
  selectChild: (child: ChildProfile) => void;
  
  // Deck Management  
  loadDecks: () => Promise<void>;
  createDeck: (deckData: CreateDeckRequest) => Promise<Deck>;
  selectDeck: (deckId: string) => void;
  
  // Session Management
  startSession: (options: SessionOptions) => Promise<TestSession>;
  submitAnswer: (questionId: string, answer: string) => Promise<AnswerResult>;
  completeSession: () => Promise<SessionResults>;
  
  // UI Actions
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  addNotification: (notification: Notification) => void;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // Initial state
  user: null,
  selectedChild: null,
  decks: [],
  currentDeck: null,
  currentSession: null,
  sessionProgress: { currentQuestion: 0, totalQuestions: 0, correctAnswers: 0 },
  loading: {},
  errors: {},
  notifications: [],
  
  // Actions
  setUser: (user) => set({ user }),
  selectChild: (child) => set({ selectedChild: child }),
  
  loadDecks: async () => {
    set(state => ({ loading: { ...state.loading, decks: true } }));
    try {
      const decks = await deckService.getUserDecks(get().user!.id);
      set({ decks, loading: { ...get().loading, decks: false } });
    } catch (error) {
      set(state => ({ 
        errors: { ...state.errors, decks: error.message },
        loading: { ...state.loading, decks: false }
      }));
    }
  },
  
  // ... other actions
}));
```

### API Integration Layer

#### Service Layer Architecture
```typescript
class APIService {
  private baseURL: string;
  private supabase: SupabaseClient;
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL!;
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { data: { session } } = await this.supabase.auth.getSession();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session.access_token}` : '',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.code, error.message, error.childFriendlyMessage);
    }
    
    return response.json();
  }
}

// Specialized Services
export class DeckService extends APIService {
  async getUserDecks(userId: string): Promise<Deck[]> {
    return this.request<Deck[]>(`/decks?userId=${userId}`);
  }
  
  async createDeck(data: CreateDeckRequest): Promise<Deck> {
    const formData = new FormData();
    formData.append('csvFile', data.csvFile);
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('childId', data.childId);
    
    return this.request<Deck>('/decks', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type for FormData
    });
  }
  
  async getDeckDetails(deckId: string): Promise<DeckDetail> {
    return this.request<DeckDetail>(`/decks/${deckId}`);
  }
}

export class SessionService extends APIService {
  async startSession(options: SessionOptions): Promise<TestSession> {
    return this.request<TestSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }
  
  async submitAnswer(sessionId: string, answer: AnswerSubmission): Promise<AnswerResult> {
    return this.request<AnswerResult>(`/sessions/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(answer)
    });
  }
  
  async completeSession(sessionId: string): Promise<SessionResults> {
    return this.request<SessionResults>(`/sessions/${sessionId}/complete`, {
      method: 'POST'
    });
  }
}
```

---

## Performance Optimization Specifications

### Core Web Vitals Targets (Child-Optimized)

**Target Metrics**:
- **Largest Contentful Paint (LCP)**: < 1.5 seconds
- **First Input Delay (FID)**: < 50 milliseconds  
- **Cumulative Layout Shift (CLS)**: < 0.05
- **First Contentful Paint (FCP)**: < 1.0 seconds

**Child-Specific Considerations**:
- **Attention Span**: 3-second maximum loading tolerance
- **Visual Feedback**: Loading animations within 100ms
- **Error Recovery**: < 1 second error state transitions
- **Session Persistence**: Auto-save every 30 seconds

### Image Optimization Strategy

```typescript
// Next.js Image Component Configuration
const imageConfig = {
  domains: ['supabase.co', 'cdn.recallforge.com'],
  formats: ['image/webp', 'image/avif'],
  sizes: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1200px) 50vw',
    desktop: '33vw'
  }
};

// Optimized Image Component
export const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  priority = false,
  ...props
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..." // Low-quality placeholder
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
};
```

### Code Splitting Strategy

```typescript
// Route-based splitting
const DashboardPage = dynamic(() => import('../pages/dashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const PracticePage = dynamic(() => import('../pages/practice'), {
  loading: () => <PracticeLoadingScreen />
});

// Component-based splitting for heavy features
const CSVUploader = dynamic(() => import('../components/CSVUploader'), {
  loading: () => <div>Preparing upload tool...</div>,
  ssr: false
});

const ProgressCharts = dynamic(() => import('../components/ProgressCharts'), {
  loading: () => <ChartSkeleton />
});
```

---

## Accessibility & Compliance Specifications

### COPPA Compliance Implementation

**Data Collection Minimization**:
```typescript
interface ChildDataPolicy {
  // Required fields only
  essentialData: {
    firstName: string; // No last name stored
    gradeLevel: number;
    parentId: string;
  };
  
  // Optional fields with explicit consent
  optionalData: {
    birthYear?: number; // For age-appropriate content only
    preferredSubjects?: string[];
  };
  
  // Prohibited data
  prohibited: [
    'fullName',
    'address', 
    'phoneNumber',
    'socialSecurityNumber',
    'photos',
    'biometricData'
  ];
}

// Automatic data deletion after account closure
const scheduleDataDeletion = async (childId: string, deleteAfterDays: number = 30) => {
  await scheduleJob('deleteChildData', {
    childId,
    scheduledFor: new Date(Date.now() + deleteAfterDays * 24 * 60 * 60 * 1000)
  });
};
```

**Parental Consent Management**:
```typescript
interface ParentalConsent {
  parentId: string;
  childId: string;
  consentDate: Date;
  consentVersion: string;
  ipAddress: string;
  userAgent: string;
  consentMethod: 'electronic' | 'paper' | 'verbal_plus';
}

const verifyParentalConsent = async (childId: string): Promise<boolean> => {
  const consent = await getParentalConsent(childId);
  
  if (!consent) return false;
  if (isConsentExpired(consent)) return false;
  if (!isConsentVersionCurrent(consent)) return false;
  
  return true;
};
```

### WCAG 2.1 AA Compliance

**Color Contrast Requirements**:
```css
/* Text contrast ratios */
.text-primary { color: #2C3E50; } /* 12.63:1 ratio on white */
.text-secondary { color: #7F8C8D; } /* 4.54:1 ratio on white */
.text-light { color: #BDC3C7; } /* 3.06:1 ratio on white - large text only */

/* Interactive element contrast */
.button-primary {
  background: #4A90E2; /* 3.36:1 ratio with white text */
  color: #FFFFFF;
}

.button-secondary {
  background: #FFFFFF;
  color: #4A90E2; /* 3.36:1 ratio */
  border: 2px solid #4A90E2;
}
```

**Focus Management**:
```css
/* Visible focus indicators */
.focusable:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip links for keyboard navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

**Screen Reader Support**:
```typescript
// ARIA labels and descriptions
const AccessibleCard = ({ title, description, children }) => (
  <div 
    role="region"
    aria-labelledby={`card-title-${id}`}
    aria-describedby={`card-desc-${id}`}
  >
    <h3 id={`card-title-${id}`}>{title}</h3>
    <p id={`card-desc-${id}`} className="sr-only">{description}</p>
    {children}
  </div>
);

// Live regions for dynamic content
const ProgressAnnouncer = ({ progress, message }) => (
  <div 
    aria-live="polite" 
    aria-atomic="true"
    className="sr-only"
  >
    {message} {progress}% complete
  </div>
);
```

---

## Testing Strategy & Quality Assurance

### Child User Testing Protocol

**Usability Testing with Children**:
```typescript
interface ChildTestingSession {
  childAge: number;
  gradeLevel: number;
  deviceType: 'tablet' | 'desktop' | 'mobile';
  parentPresent: boolean;
  
  tasks: Array<{
    name: string;
    description: string;
    successCriteria: string[];
    timeLimit?: number;
  }>;
  
  observations: {
    completionTime: number;
    errors: UserError[];
    frustrationPoints: string[];
    delightMoments: string[];
    helpRequests: number;
  };
}

const childTestingTasks = [
  {
    name: "Find and start Latin practice",
    description: "Navigate to your Latin deck and begin practicing",
    successCriteria: [
      "Finds deck within 30 seconds",
      "Successfully starts practice session",
      "Understands question format"
    ],
    timeLimit: 60
  },
  {
    name: "Answer practice questions",
    description: "Complete 5 practice questions",
    successCriteria: [
      "Selects answers confidently",
      "Understands feedback messages",
      "Continues after incorrect answers"
    ]
  },
  {
    name: "View progress results",
    description: "Check results after practice session",
    successCriteria: [
      "Understands score display",
      "Shows excitement about achievements",
      "Wants to practice again"
    ]
  }
];
```

### Automated Testing Suite

**Component Testing**:
```typescript
// React Testing Library + Jest
describe('PracticeInterface', () => {
  const mockSession = {
    id: 'session-123',
    questions: [
      {
        id: 'q1',
        questionText: 'What does "aqua" mean?',
        options: ['water', 'fire', 'earth', 'air'],
        correctAnswer: 'water'
      }
    ]
  };
  
  it('displays question and options correctly', () => {
    render(<PracticeInterface session={mockSession} />);
    
    expect(screen.getByText('What does "aqua" mean?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /water/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
  
  it('provides immediate feedback on correct answer', async () => {
    const user = userEvent.setup();
    render(<PracticeInterface session={mockSession} />);
    
    await user.click(screen.getByRole('button', { name: /water/i }));
    
    expect(screen.getByText(/excellent work/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });
  
  it('shows encouraging message on incorrect answer', async () => {
    const user = userEvent.setup();
    render(<PracticeInterface session={mockSession} />);
    
    await user.click(screen.getByRole('button', { name: /fire/i }));
    
    expect(screen.getByText(/good try/i)).toBeInTheDocument();
    expect(screen.getByText(/let's learn/i)).toBeInTheDocument();
  });
});
```

**Integration Testing**:
```typescript
describe('CSV Upload Flow', () => {
  it('completes full upload and processing cycle', async () => {
    const user = userEvent.setup();
    
    // Mock file
    const csvFile = new File(['question,answer\n"What is aqua?",water'], 'test.csv', {
      type: 'text/csv'
    });
    
    render(<CSVUploadFlow />);
    
    // Step 1: File selection
    const fileInput = screen.getByLabelText(/choose your csv/i);
    await user.upload(fileInput, csvFile);
    
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    
    // Step 2: Column mapping
    await user.click(screen.getByRole('button', { name: /continue/i }));
    
    expect(screen.getByText(/review your questions/i)).toBeInTheDocument();
    
    // Step 3: Deck customization
    await user.click(screen.getByRole('button', { name: /create deck/i }));
    
    const nameInput = screen.getByLabelText(/deck name/i);
    await user.type(nameInput, 'Test Latin Deck');
    
    // Step 4: Processing
    await user.click(screen.getByRole('button', { name: /create deck/i }));
    
    expect(screen.getByText(/creating your learning deck/i)).toBeInTheDocument();
  });
});
```

### Performance Testing

**Load Testing Configuration**:
```javascript
// Artillery.js load testing
export default {
  config: {
    target: 'https://recallforge.com',
    phases: [
      { duration: 60, arrivalRate: 5 }, // Warm up
      { duration: 300, arrivalRate: 25 }, // Normal load (typical after-school usage)
      { duration: 120, arrivalRate: 50 }, // Peak load (weekend practice time)
      { duration: 60, arrivalRate: 10 } // Cool down
    ],
    processor: './test-processor.js'
  },
  scenarios: [
    {
      name: 'Child Practice Session',
      weight: 70,
      flow: [
        { post: { url: '/api/auth/signin', json: { email: '{{ parentEmail }}', password: '{{ password }}' } } },
        { get: { url: '/dashboard' } },
        { get: { url: '/deck/{{ deckId }}' } },
        { post: { url: '/api/sessions', json: { deckId: '{{ deckId }}', childId: '{{ childId }}' } } },
        { post: { url: '/api/sessions/{{ sessionId }}/answer', json: { questionId: '{{ questionId }}', selectedAnswer: 'A' } } }
      ]
    },
    {
      name: 'CSV Upload',
      weight: 20,
      flow: [
        { post: { url: '/api/auth/signin' } },
        { post: { url: '/api/decks', formData: { csvFile: '@test-latin.csv', name: 'Load Test Deck' } } }
      ]
    },
    {
      name: 'Parent Dashboard',
      weight: 10,
      flow: [
        { post: { url: '/api/auth/signin' } },
        { get: { url: '/parent/dashboard' } },
        { get: { url: '/api/analytics/child/{{ childId }}' } }
      ]
    }
  ]
};
```

---

## Mobile Optimization Specifications

### Responsive Design Breakpoints

```css
/* Custom breakpoints for child-friendly sizing */
:root {
  --breakpoint-xs: 320px;  /* Small phones */
  --breakpoint-sm: 480px;  /* Large phones */
  --breakpoint-md: 768px;  /* Tablets */
  --breakpoint-lg: 1024px; /* Small desktops */
  --breakpoint-xl: 1280px; /* Large desktops */
}

/* Touch-friendly sizing */
@media (max-width: 768px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
    padding: 12px;
  }
  
  .answer-option {
    min-height: 60px;
    font-size: 18px;
    margin-bottom: 12px;
  }
  
  .question-text {
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 24px;
  }
}
```

### PWA Configuration

```typescript
// next.config.js PWA setup
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.recallforge\.com\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    }
  ]
});
```

**Offline Functionality**:
```typescript
// Service Worker for offline practice
const CACHE_NAME = 'recallforge-offline-v1';
const OFFLINE_URLS = [
  '/offline',
  '/practice/offline',
  '/static/offline-data.json'
];

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/sessions')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return cached offline practice session
        return caches.match('/practice/offline');
      })
    );
  }
});

// Store completed sessions for later sync
const storeOfflineSession = async (sessionData) => {
  const offlineSessions = await getStoredSessions();
  offlineSessions.push({
    ...sessionData,
    timestamp: Date.now(),
    synced: false
  });
  
  await localStorage.setItem('offline-sessions', JSON.stringify(offlineSessions));
};
```

---

## Deployment & DevOps Specifications

### Cloudflare Pages Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: recallforge
          directory: out
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Environment Configuration

```typescript
// Environment variables schema
const envSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  
  // AI Integration
  OPENAI_API_KEY: z.string(),
  OPENAI_ORG_ID: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_OFFLINE: z.boolean().default(false),
  NEXT_PUBLIC_DEBUG_MODE: z.boolean().default(false),
  
  // Security
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  
  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

## Conclusion & Next Steps

This comprehensive Project Design document provides the complete technical specification for building RecallForge, an elementary school-focused flashcard platform. Every aspect has been designed with 9-year-old Lilly as the primary user, ensuring child-friendly interfaces, COPPA compliance, and engaging learning experiences.

### Development Phases

**Phase 1: Core MVP (4-6 weeks)**
- Authentication and user management
- Basic dashboard and deck management
- CSV upload with AI processing
- Core practice interface
- Essential parent dashboard

**Phase 2: Enhanced Features (3-4 weeks)**
- Advanced analytics and reporting
- Gamification and achievement system
- Mobile optimization and PWA features
- Performance optimization

**Phase 3: Scale & Polish (2-3 weeks)**
- Load testing and optimization
- Advanced accessibility features
- Teacher dashboard and bulk operations
- Mobile app preparation

### Success Criteria
- **Child Engagement**: 85%+ completion rate for started sessions
- **Learning Outcomes**: 20%+ improvement in school quiz scores
- **User Retention**: 70%+ weekly active users after month 1
- **Performance**: <2 second load times on all devices
- **Safety**: 100% COPPA compliance with zero data incidents

The platform is architected to scale from individual families to school districts while maintaining the child-friendly experience that makes learning feel like play rather than work.