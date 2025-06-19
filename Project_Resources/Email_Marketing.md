# Email Marketing Strategy & Beehiiv Integration
## COPPA-Compliant Parent & Teacher Communication

### Overview
RecallForge's email marketing strategy focuses exclusively on parent and teacher education, support, and engagement. All email collection and communication strictly adheres to COPPA compliance by never collecting or targeting children under 13.

**Key Principles**:
- Parent and teacher-only communication
- Educational value in every email
- COPPA-compliant data collection
- Segmented, personalized content
- Clear opt-in and opt-out processes

---

## Target Audience Segmentation

### Primary Segments

#### **Parent Subscribers**
```typescript
interface ParentSubscriber {
  segment: 'parent';
  profile: {
    subscriptionPlan: 'free' | 'individual' | 'family' | 'educator';
    childrenCount: number;
    childAges: number[];
    subjects: string[]; // Latin, Math, Science, etc.
    homeschoolStatus: boolean;
    engagementLevel: 'high' | 'medium' | 'low' | 'dormant';
  };
  preferences: {
    weeklyTips: boolean;
    progressUpdates: boolean;
    productAnnouncements: boolean;
    successStories: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  metrics: {
    childSessionsLastWeek: number;
    averageScores: number;
    streakDays: number;
    lastActiveDate: Date;
  };
}
```

#### **Teacher Subscribers**
```typescript
interface TeacherSubscriber {
  segment: 'teacher';
  profile: {
    schoolType: 'public' | 'private' | 'homeschool' | 'charter';
    gradesTaught: number[];
    studentCount: number;
    subjects: string[];
    yearsExperience: number;
    subscriptionPlan: string;
  };
  preferences: {
    curriculumIdeas: boolean;
    classroomTips: boolean;
    educationalResearch: boolean;
    featureUpdates: boolean;
    resourceLibrary: boolean;
  };
  metrics: {
    classroomEngagement: number;
    resourceDownloads: number;
    platformUsage: number;
  };
}
```

---

## Beehiiv API Integration

### Authentication & Setup

```typescript
class BeehiivService {
  private apiKey: string;
  private publicationId: string;
  private baseUrl = 'https://api.beehiiv.com/v2';
  
  constructor() {
    this.apiKey = process.env.BEEHIIV_API_KEY!;
    this.publicationId = process.env.BEEHIIV_PUBLICATION_ID!;
    
    if (!this.apiKey || !this.publicationId) {
      throw new Error('Missing Beehiiv API credentials');
    }
  }
  
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Beehiiv API error: ${error.message}`);
    }
    
    return response.json();
  }
}
```

### Subscription Management

#### **Create Subscriber**
```typescript
interface CreateSubscriberParams {
  email: string;
  userRole: 'parent' | 'teacher';
  subscriptionType: 'parent_updates' | 'teacher_resources' | 'product_announcements';
  userMetadata: {
    userId: string;
    childrenCount?: number;
    subjects?: string[];
    schoolType?: string;
    signupSource: string;
  };
  doubleOptIn?: boolean;
}

async function createBeehiivSubscriber(params: CreateSubscriberParams): Promise<string> {
  // COPPA compliance check
  if (params.userRole === 'child') {
    throw new Error('Cannot subscribe children to email marketing lists');
  }
  
  const subscriptionData = {
    email: params.email,
    reactivate_existing: false,
    send_welcome_email: true,
    utm_source: 'recallforge_platform',
    utm_medium: params.subscriptionType,
    utm_campaign: params.userMetadata.signupSource,
    double_opt_in: params.doubleOptIn ?? true,
    custom_fields: {
      user_role: params.userRole,
      user_id: params.userMetadata.userId,
      children_count: params.userMetadata.childrenCount || 0,
      subjects: params.userMetadata.subjects?.join(',') || '',
      school_type: params.userMetadata.schoolType || '',
      subscription_type: params.subscriptionType,
      signup_date: new Date().toISOString(),
      signup_source: params.userMetadata.signupSource,
      platform_version: process.env.APP_VERSION || 'unknown'
    }
  };
  
  const response = await beehiivService.makeRequest(
    `/publications/${beehiivService.publicationId}/subscriptions`, 
    {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    }
  );
  
  // Store subscription in our database
  await storeEmailSubscription({
    userId: params.userMetadata.userId,
    email: params.email,
    beehiivSubscriberId: response.data.id,
    subscriptionType: params.subscriptionType,
    isActive: true,
    doubleOptInConfirmed: false, // Will be updated via webhook
    source: params.userMetadata.signupSource
  });
  
  return response.data.id;
}
```

#### **Update Subscriber Segmentation**
```typescript
async function updateSubscriberSegmentation(
  subscriberId: string,
  userProgress: {
    engagementLevel: 'high' | 'medium' | 'low' | 'dormant';
    totalSessions: number;
    averageScore: number;
    daysSinceLastActive: number;
    planType: string;
  }
): Promise<void> {
  
  const segmentData = {
    custom_fields: {
      engagement_level: userProgress.engagementLevel,
      total_sessions: userProgress.totalSessions,
      average_score: userProgress.averageScore,
      days_since_active: userProgress.daysSinceLastActive,
      plan_type: userProgress.planType,
      last_updated: new Date().toISOString(),
      
      // Derived segments for targeting
      segment_highly_engaged: userProgress.engagementLevel === 'high',
      segment_needs_engagement: userProgress.daysSinceLastActive > 7,
      segment_high_achiever: userProgress.averageScore > 85,
      segment_needs_support: userProgress.averageScore < 60,
      segment_premium_user: ['individual', 'family', 'educator'].includes(userProgress.planType),
      segment_individual_user: userProgress.planType === 'individual',
      segment_family_user: userProgress.planType === 'family'
    }
  };
  
  await beehiivService.makeRequest(
    `/publications/${beehiivService.publicationId}/subscriptions/${subscriberId}`,
    {
      method: 'PUT',
      body: JSON.stringify(segmentData)
    }
  );
  
  // Update our database record
  await updateEmailSubscriberSegmentation(subscriberId, userProgress);
}
```

### Webhook Integration

#### **Handle Beehiiv Webhooks**
```typescript
interface BeehiivWebhookEvent {
  type: 'subscriber.created' | 'subscriber.updated' | 'subscriber.unsubscribed' | 
        'email.opened' | 'email.clicked' | 'email.bounced';
  data: {
    subscriber: {
      id: string;
      email: string;
      status: 'active' | 'unsubscribed' | 'bounced';
      custom_fields: Record<string, any>;
      created: string;
      confirmed: boolean;
    };
    email?: {
      id: string;
      subject: string;
      sent_at: string;
      opened_at?: string;
      clicked_at?: string;
    };
  };
}

async function handleBeehiivWebhook(event: BeehiivWebhookEvent): Promise<void> {
  switch (event.type) {
    case 'subscriber.created':
      await handleSubscriberCreated(event.data.subscriber);
      break;
      
    case 'subscriber.unsubscribed':
      await handleSubscriberUnsubscribed(event.data.subscriber);
      break;
      
    case 'email.opened':
      await trackEmailEngagement(event.data.subscriber.id, 'opened', event.data.email!);
      break;
      
    case 'email.clicked':
      await trackEmailEngagement(event.data.subscriber.id, 'clicked', event.data.email!);
      break;
      
    case 'email.bounced':
      await handleEmailBounced(event.data.subscriber);
      break;
  }
}

async function handleSubscriberCreated(subscriber: BeehiivWebhookEvent['data']['subscriber']): Promise<void> {
  // Update our database with confirmation status
  await updateEmailSubscription(subscriber.id, {
    doubleOptInConfirmed: subscriber.confirmed,
    beehiivStatus: subscriber.status,
    confirmedAt: subscriber.confirmed ? new Date() : null
  });
  
  // If confirmed, trigger welcome sequence
  if (subscriber.confirmed) {
    const userId = subscriber.custom_fields.user_id;
    const userRole = subscriber.custom_fields.user_role;
    
    await triggerWelcomeEmailSequence(userId, userRole);
  }
}
```

---

## Email Content Strategy

### Newsletter Types

#### **Weekly Parent Updates**
```typescript
interface WeeklyParentNewsletter {
  subject: string;
  personalizedGreeting: string;
  sections: {
    childProgress: {
      childName: string;
      weeklyStats: {
        sessionsCompleted: number;
        averageScore: number;
        timeSpent: number;
        improvementAreas: string[];
        celebrations: string[];
      };
    };
    learningTip: {
      title: string;
      content: string;
      actionableSteps: string[];
      ageGroup: string;
    };
    communityHighlight: {
      anonymousSuccessStory: string;
      encouragingMessage: string;
    };
    productUpdate?: {
      feature: string;
      benefit: string;
      howToUse: string;
    };
  };
  ctaSection: {
    primaryAction: string;
    secondaryAction: string;
  };
}

// Sample newsletter content
const sampleParentNewsletter: WeeklyParentNewsletter = {
  subject: "Lilly's amazing progress this week! 🌟",
  personalizedGreeting: "Hi Sarah!",
  sections: {
    childProgress: {
      childName: "Lilly",
      weeklyStats: {
        sessionsCompleted: 5,
        averageScore: 87,
        timeSpent: 78, // minutes
        improvementAreas: ["Family vocabulary", "Verb conjugations"],
        celebrations: ["Perfect score on Animals category!", "5-day practice streak!"]
      }
    },
    learningTip: {
      title: "Make Latin stick with daily life connections",
      content: "Help your child connect Latin words to everyday objects. When you see a dog, remind them it's 'canis' in Latin!",
      actionableSteps: [
        "Point out Latin root words in English",
        "Create Latin labels for household items",
        "Use Latin words during dinner conversations"
      ],
      ageGroup: "Elementary (Ages 8-12)"
    },
    communityHighlight: {
      anonymousSuccessStory: "A 4th grader improved their vocabulary quiz scores by 40% in just 3 weeks using RecallForge!",
      encouragingMessage: "Every child learns at their own pace. Consistency is key!"
    }
  },
  ctaSection: {
    primaryAction: "View Lilly's detailed progress",
    secondaryAction: "Upload new vocabulary for next week"
  }
};
```

#### **Monthly Teacher Resources**
```typescript
interface MonthlyTeacherNewsletter {
  subject: string;
  sections: {
    curriculumSpotlight: {
      topic: string;
      gradeLevel: string;
      lessonIdeas: string[];
      downloadableResources: Array<{
        title: string;
        description: string;
        downloadUrl: string;
      }>;
    };
    classroomTips: {
      title: string;
      tip: string;
      implementation: string[];
      expectedOutcome: string;
    };
    featureUpdate: {
      newFeature: string;
      educatorBenefit: string;
      setupInstructions: string[];
    };
    successMetrics: {
      classroomImprovements: Array<{
        metric: string;
        improvement: string;
        schoolType: string;
      }>;
    };
  };
}
```

### Email Automation Sequences

#### **Welcome Email Series**
```typescript
const welcomeEmailSequence = {
  parent: [
    {
      day: 0,
      subject: "Welcome to RecallForge! Let's get started 🎯",
      content: {
        greeting: "Welcome to the RecallForge family!",
        mainMessage: "We're excited to help your child excel in their Latin studies.",
        steps: [
          "Upload your first CSV file",
          "Create your child's profile",
          "Start their first practice session"
        ],
        support: "Our team is here to help every step of the way."
      }
    },
    {
      day: 3,
      subject: "How's your first week going? Tips inside! 💡",
      content: {
        checkIn: "How has your family's first week with RecallForge been?",
        tips: [
          "Start with 10-15 minute sessions",
          "Celebrate every improvement",
          "Make it part of daily routine"
        ],
        troubleshooting: "Having any issues? We're here to help!"
      }
    },
    {
      day: 7,
      subject: "Week 1 complete! See your child's progress 📈",
      content: {
        celebration: "Congratulations on completing your first week!",
        progressSummary: "Here's what your child accomplished...",
        nextSteps: "Ready for week 2? Here's what to focus on...",
        community: "Join other parents in our learning community"
      }
    }
  ],
  teacher: [
    {
      day: 0,
      subject: "Transform your Latin classroom with RecallForge 🏫",
      content: {
        welcome: "Welcome to RecallForge for Educators!",
        classroomBenefits: [
          "Instant multiple choice generation",
          "Student progress analytics",
          "Curriculum alignment tools"
        ],
        gettingStarted: "Let's set up your first classroom deck..."
      }
    },
    {
      day: 2,
      subject: "Classroom setup tips from fellow Latin teachers 👩‍🏫",
      content: {
        peerAdvice: "Here's how other Latin teachers are using RecallForge...",
        bestPractices: [
          "Upload weekly vocabulary lists",
          "Use progress reports for parent conferences",
          "Create review decks for exams"
        ],
        resources: "Download our curriculum integration guide"
      }
    }
  ]
};
```

#### **Re-engagement Campaign**
```typescript
const reEngagementSequence = [
  {
    trigger: "7 days inactive",
    subject: "We miss you! Come back to continue learning 🌟",
    content: {
      personalMessage: "It's been a week since [Child Name]'s last practice session.",
      encouragement: "Even 10 minutes of practice can make a big difference!",
      easyReturn: "Click here to jump right back into learning",
      support: "Need help getting back on track? We're here for you."
    }
  },
  {
    trigger: "14 days inactive",
    subject: "Don't lose momentum! Quick Latin practice ideas 💪",
    content: {
      motivation: "Consistency is key to language learning success.",
      quickWins: [
        "5-minute vocabulary review",
        "Practice during car rides",
        "Make it a family challenge"
      ],
      specialOffer: "Need fresh content? Upload a new deck today!",
      successStory: "Other families have seen great results coming back..."
    }
  },
  {
    trigger: "30 days inactive",
    subject: "Your learning journey matters - let's restart together 🔄",
    content: {
      empathy: "We understand that life gets busy.",
      freshStart: "Ready for a fresh start? We'll help you succeed.",
      personalization: "Let's customize RecallForge for your family's needs",
      humanTouch: "Reply to this email - our team wants to help personally."
    }
  }
];
```

---

## COPPA Compliance Framework

### Data Collection Policies

```typescript
class COPPAEmailCompliance {
  // Strict age verification for email collection
  static validateEmailEligibility(userAge: number, role: string): boolean {
    if (role === 'child' || userAge < 13) {
      throw new Error('Email addresses cannot be collected from children under 13');
    }
    return true;
  }
  
  // Parent/teacher only subscription validation
  static async validateSubscriptionRequest(
    email: string, 
    userId: string
  ): Promise<boolean> {
    
    const user = await getUserById(userId);
    
    // Block any attempt to subscribe child accounts
    if (user.role === 'child') {
      throw new Error('Child accounts cannot subscribe to email marketing');
    }
    
    // Verify email belongs to the account holder
    if (user.email !== email) {
      throw new Error('Email must match account holder');
    }
    
    return true;
  }
  
  // Child data separation in email content
  static sanitizeChildDataForEmail(childData: {
    name: string;
    progress: any;
    achievements: any;
  }): SafeEmailContent {
    
    return {
      // Only use first name, never full name
      childName: childData.name.split(' ')[0],
      
      // Aggregate progress data only
      progressSummary: {
        sessionsThisWeek: childData.progress.sessionCount,
        averageScore: Math.round(childData.progress.averageScore),
        improvementCategories: childData.progress.weakAreas?.slice(0, 2) || []
      },
      
      // General achievements only
      achievements: childData.achievements.filter(a => a.type !== 'personal_identifier')
    };
  }
}
```

### Data Retention and Deletion

```typescript
class EmailDataManagement {
  // Automated data deletion for closed accounts
  static async handleAccountDeletion(userId: string): Promise<void> {
    const emailSubscriptions = await getEmailSubscriptionsByUser(userId);
    
    for (const subscription of emailSubscriptions) {
      // Remove from Beehiiv
      await beehiivService.makeRequest(
        `/publications/${beehiivService.publicationId}/subscriptions/${subscription.beehiivSubscriberId}`,
        { method: 'DELETE' }
      );
      
      // Mark as deleted in our database
      await markEmailSubscriptionDeleted(subscription.id);
    }
    
    // Log compliance action
    await logComplianceAction(userId, 'email_data_purged', {
      subscriptionCount: emailSubscriptions.length,
      deletionDate: new Date().toISOString()
    });
  }
  
  // Regular compliance audits
  static async auditEmailDataCompliance(): Promise<ComplianceReport> {
    const allSubscriptions = await getAllEmailSubscriptions();
    
    const issues = [];
    
    for (const subscription of allSubscriptions) {
      const user = await getUserById(subscription.userId);
      
      // Check for child accounts (should be zero)
      if (user.role === 'child') {
        issues.push({
          type: 'child_email_found',
          subscriptionId: subscription.id,
          userId: user.id
        });
      }
      
      // Check for orphaned subscriptions
      if (!user.is_active) {
        issues.push({
          type: 'orphaned_subscription',
          subscriptionId: subscription.id,
          userId: user.id
        });
      }
    }
    
    return {
      auditDate: new Date().toISOString(),
      totalSubscriptions: allSubscriptions.length,
      issuesFound: issues.length,
      issues,
      complianceScore: ((allSubscriptions.length - issues.length) / allSubscriptions.length) * 100
    };
  }
}
```

---

## Performance and Analytics

### Email Performance Tracking

```typescript
interface EmailMetrics {
  campaignId: string;
  sentAt: Date;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    
    // Calculated rates
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
  };
  segmentBreakdown: {
    segment: string;
    sent: number;
    opened: number;
    clicked: number;
  }[];
}

class EmailAnalyticsService {
  async trackEmailPerformance(campaignId: string): Promise<EmailMetrics> {
    // Get metrics from Beehiiv API
    const beehiivMetrics = await beehiivService.makeRequest(
      `/publications/${beehiivService.publicationId}/campaigns/${campaignId}/metrics`
    );
    
    // Calculate derived metrics
    const metrics = {
      ...beehiivMetrics,
      deliveryRate: (beehiivMetrics.delivered / beehiivMetrics.sent) * 100,
      openRate: (beehiivMetrics.opened / beehiivMetrics.delivered) * 100,
      clickRate: (beehiivMetrics.clicked / beehiivMetrics.opened) * 100,
      unsubscribeRate: (beehiivMetrics.unsubscribed / beehiivMetrics.delivered) * 100
    };
    
    // Store in our analytics database
    await storeEmailMetrics(campaignId, metrics);
    
    return metrics;
  }
  
  async generateEmailInsights(): Promise<EmailInsights> {
    const last30Days = await getEmailMetrics(30);
    
    return {
      bestPerformingSubjectLines: await findTopSubjectLines(last30Days),
      optimalSendTimes: await analyzeOptimalSendTimes(last30Days),
      segmentPerformance: await compareSegmentPerformance(last30Days),
      contentRecommendations: await generateContentRecommendations(last30Days),
      unsubscribeAnalysis: await analyzeUnsubscribeReasons(last30Days)
    };
  }
}
```

### A/B Testing Framework

```typescript
interface EmailABTest {
  testId: string;
  name: string;
  variants: {
    control: EmailVariant;
    treatment: EmailVariant;
  };
  allocation: {
    control: number; // percentage
    treatment: number; // percentage
  };
  metrics: {
    primaryGoal: 'open_rate' | 'click_rate' | 'conversion_rate';
    minimumSampleSize: number;
    confidenceLevel: number;
  };
  status: 'draft' | 'running' | 'completed' | 'paused';
}

class EmailABTestingService {
  async createABTest(testConfig: EmailABTest): Promise<string> {
    // Create test in Beehiiv
    const beehiivTest = await beehiivService.makeRequest(
      `/publications/${beehiivService.publicationId}/ab-tests`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: testConfig.name,
          variants: testConfig.variants,
          allocation: testConfig.allocation,
          metrics: testConfig.metrics
        })
      }
    );
    
    // Store test configuration
    await storeABTestConfig(testConfig.testId, {
      beehiivTestId: beehiivTest.data.id,
      ...testConfig
    });
    
    return beehiivTest.data.id;
  }
  
  async analyzeABTestResults(testId: string): Promise<ABTestResults> {
    const test = await getABTestConfig(testId);
    const results = await beehiivService.makeRequest(
      `/publications/${beehiivService.publicationId}/ab-tests/${test.beehiivTestId}/results`
    );
    
    // Statistical significance calculation
    const significance = this.calculateStatisticalSignificance(
      results.control,
      results.treatment,
      test.metrics.confidenceLevel
    );
    
    return {
      testId,
      winner: significance.winner,
      confidenceLevel: significance.confidence,
      improvement: significance.improvement,
      recommendation: significance.recommendation,
      rawResults: results
    };
  }
}
```

---

## Integration with Learning Platform

### Triggered Email Campaigns

```typescript
class LearningTriggeredEmails {
  // Achievement-based emails
  async handleAchievementUnlocked(
    userId: string, 
    achievement: Achievement
  ): Promise<void> {
    
    const user = await getUserById(userId);
    if (!user.email_marketing_consent) return;
    
    const emailContent = {
      subject: `🎉 ${achievement.childName} just earned a new badge!`,
      template: 'achievement_celebration',
      data: {
        childName: achievement.childName,
        achievementName: achievement.name,
        achievementDescription: achievement.description,
        nextGoal: await getNextGoalForChild(achievement.childId),
        encouragementMessage: generateEncouragementMessage(achievement.type)
      }
    };
    
    await sendTriggeredEmail(user.beehiiv_subscriber_id, emailContent);
  }
  
  // Progress milestone emails
  async handleProgressMilestone(
    userId: string,
    milestone: ProgressMilestone
  ): Promise<void> {
    
    const emailTemplates = {
      'week_1_complete': {
        subject: 'Week 1 down! Your child is off to a great start 🌟',
        template: 'milestone_week1'
      },
      'month_1_complete': {
        subject: 'One month of amazing progress! 📈',
        template: 'milestone_month1'
      },
      '100_questions_answered': {
        subject: '100 questions mastered! What an achievement! 🎯',
        template: 'milestone_questions'
      },
      'perfect_week': {
        subject: 'Perfect week! Your child is unstoppable! ⭐',
        template: 'milestone_perfect'
      }
    };
    
    const template = emailTemplates[milestone.type];
    if (template) {
      await sendTriggeredEmail(user.beehiiv_subscriber_id, {
        ...template,
        data: milestone.data
      });
    }
  }
  
  // Usage-based interventions
  async handleUsagePattern(
    userId: string,
    pattern: UsagePattern
  ): Promise<void> {
    
    const interventions = {
      'declining_scores': {
        subject: 'Let\'s get back on track together! 💪',
        template: 'intervention_scores',
        tips: [
          'Try shorter practice sessions',
          'Review easier categories first',
          'Take breaks between sessions'
        ]
      },
      'streak_about_to_break': {
        subject: 'Don\'t break that awesome streak! ⚡',
        template: 'intervention_streak',
        urgency: 'Your child hasn\'t practiced today - keep the momentum going!'
      },
      'irregular_usage': {
        subject: 'Consistency is key - here\'s how to build routine 🔄',
        template: 'intervention_consistency',
        schedule: await generateOptimalSchedule(userId)
      }
    };
    
    const intervention = interventions[pattern.type];
    if (intervention) {
      await sendTriggeredEmail(user.beehiiv_subscriber_id, {
        ...intervention,
        data: { ...pattern.data, ...intervention }
      });
    }
  }
}
```

### Email Preference Management

```typescript
interface EmailPreferences {
  userId: string;
  beehiivSubscriberId: string;
  preferences: {
    // Content types
    weeklyProgress: boolean;
    achievementAlerts: boolean;
    learningTips: boolean;
    productUpdates: boolean;
    successStories: boolean;
    educationalResearch: boolean;
    
    // Frequency settings
    frequency: 'daily' | 'weekly' | 'monthly';
    digestFormat: 'individual' | 'digest';
    
    // Timing preferences
    preferredDayOfWeek: number; // 0-6
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
    timezone: string;
  };
  managementUrls: {
    updatePreferences: string;
    unsubscribeAll: string;
    temporaryPause: string;
  };
}

class EmailPreferenceManager {
  async updateEmailPreferences(
    userId: string,
    newPreferences: Partial<EmailPreferences['preferences']>
  ): Promise<void> {
    
    // Update in our database
    await updateUserEmailPreferences(userId, newPreferences);
    
    // Sync with Beehiiv custom fields
    const user = await getUserById(userId);
    if (user.beehiiv_subscriber_id) {
      await beehiivService.makeRequest(
        `/publications/${beehiivService.publicationId}/subscriptions/${user.beehiiv_subscriber_id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            custom_fields: {
              email_frequency: newPreferences.frequency,
              wants_progress_updates: newPreferences.weeklyProgress,
              wants_achievement_alerts: newPreferences.achievementAlerts,
              wants_learning_tips: newPreferences.learningTips,
              wants_product_updates: newPreferences.productUpdates,
              preferred_send_day: newPreferences.preferredDayOfWeek,
              preferred_send_time: newPreferences.preferredTimeOfDay,
              timezone: newPreferences.timezone
            }
          })
        }
      );
    }
  }
  
  async generateUnsubscribeUrl(userId: string, reason?: string): Promise<string> {
    const token = await generateSecureToken(userId, 'email_unsubscribe');
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unsubscribeUrl = `${baseUrl}/email/unsubscribe?token=${token}`;
    
    if (reason) {
      return `${unsubscribeUrl}&reason=${encodeURIComponent(reason)}`;
    }
    
    return unsubscribeUrl;
  }
}
```

---

## Quality Assurance and Testing

### Email Template Testing

```typescript
class EmailTemplateQA {
  async validateEmailTemplate(template: EmailTemplate): Promise<ValidationResult> {
    const issues = [];
    
    // Content validation
    if (template.subject.length > 50) {
      issues.push({
        type: 'warning',
        message: 'Subject line exceeds 50 characters - may be truncated on mobile'
      });
    }
    
    if (this.containsChildIdentifiableInfo(template.content)) {
      issues.push({
        type: 'error',
        message: 'Template contains child-identifiable information - COPPA violation'
      });
    }
    
    // Accessibility checks
    if (!this.hasProperAltText(template.content)) {
      issues.push({
        type: 'warning',
        message: 'Images missing alt text for accessibility'
      });
    }
    
    // Spam filter checks
    const spamScore = await this.calculateSpamScore(template);
    if (spamScore > 5) {
      issues.push({
        type: 'warning',
        message: `High spam score (${spamScore}/10) - may not reach inbox`
      });
    }
    
    return {
      valid: issues.filter(i => i.type === 'error').length === 0,
      issues,
      recommendations: await this.generateRecommendations(template, issues)
    };
  }
  
  private containsChildIdentifiableInfo(content: string): boolean {
    // Check for patterns that might identify children
    const patterns = [
      /\b\d{4}-\d{2}-\d{2}\b/, // Dates
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // Full names
      /\bgrade \d+ at [A-Z][a-z]+ School\b/, // School identification
      /\b\d{3}-\d{3}-\d{4}\b/ // Phone numbers
    ];
    
    return patterns.some(pattern => pattern.test(content));
  }
}
```

### Email Deliverability Monitoring

```typescript
class DeliverabilityMonitor {
  async monitorEmailHealth(): Promise<DeliverabilityReport> {
    const metrics = await this.gatherDeliverabilityMetrics();
    
    return {
      reputation: {
        senderScore: metrics.senderScore,
        domainReputation: metrics.domainReputation,
        ipReputation: metrics.ipReputation
      },
      delivery: {
        inboxRate: metrics.inboxRate,
        spamRate: metrics.spamRate,
        bounceRate: metrics.bounceRate,
        suppressionRate: metrics.suppressionRate
      },
      engagement: {
        openRate: metrics.openRate,
        clickRate: metrics.clickRate,
        unsubscribeRate: metrics.unsubscribeRate,
        complaintRate: metrics.complaintRate
      },
      recommendations: await this.generateDeliverabilityRecommendations(metrics)
    };
  }
  
  async handleDeliverabilityIssue(issue: DeliverabilityIssue): Promise<void> {
    switch (issue.type) {
      case 'high_bounce_rate':
        await this.cleanEmailList(issue.threshold);
        break;
        
      case 'spam_complaints':
        await this.reviewRecentCampaigns(issue.timeframe);
        await this.updateContentGuidelines();
        break;
        
      case 'low_engagement':
        await this.triggerReEngagementCampaign();
        await this.reviewEmailFrequency();
        break;
    }
  }
}
```

---

This comprehensive email marketing strategy ensures RecallForge can effectively communicate with parents and teachers while maintaining strict COPPA compliance and delivering genuine educational value through every interaction.