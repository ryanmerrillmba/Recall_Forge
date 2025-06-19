# Payment Integration Specification
## Stripe Implementation for RecallForge

### Overview
RecallForge requires COPPA-compliant payment processing for elementary school families. This document details the complete Stripe integration, subscription management, and child-safe billing practices.

**Key Requirements**:
- COPPA compliance (no billing for children under 13)
- Family-friendly pricing and trial periods
- Educational institution support
- Transparent billing with no hidden fees
- Graceful degradation for payment failures

---

## Subscription Architecture

### Plan Structure

#### **Free Trial Plan**
```typescript
const FREE_PLAN = {
  id: 'free_trial',
  name: 'Free Trial',
  description: 'Perfect for getting started',
  price: 0,
  billingInterval: null,
  trialDays: 14,
  features: [
    '5 flashcard decks',
    'Basic progress tracking',
    '1 child profile',
    'AI question generation'
  ],
  limits: {
    maxDecks: 5,
    maxChildren: 1,
    advancedAnalytics: false,
    prioritySupport: false,
    bulkUpload: false
  }
};
```

#### **Individual Plan**
```typescript
const INDIVIDUAL_PLAN = {
  id: 'individual_monthly',
  name: 'Individual Plan',
  description: 'Perfect for one child',
  price: 500, // $5.00/month
  billingInterval: 'month',
  stripeProductId: 'prod_individual_plan',
  stripePriceId: 'price_individual_monthly',
  features: [
    'Unlimited flashcard decks',
    'Basic analytics',
    '1 child profile',
    'AI question generation',
    'Web access'
  ],
  limits: {
    maxDecks: -1, // unlimited
    maxChildren: 1,
    advancedAnalytics: false,
    prioritySupport: false,
    bulkUpload: false
  }
};
```

#### **Family Plan**
```typescript
const FAMILY_PLAN = {
  id: 'family_monthly',
  name: 'Family Plan',
  description: 'Unlimited learning for your whole family',
  price: 1299, // $12.99/month
  billingInterval: 'month',
  stripeProductId: 'prod_family_plan',
  stripePriceId: 'price_family_monthly',
  features: [
    'Unlimited flashcard decks',
    'Advanced learning analytics',
    'Up to 5 children profiles',
    'Priority customer support',
    'Mobile app access',
    'Export progress reports'
  ],
  limits: {
    maxDecks: -1, // unlimited
    maxChildren: 5,
    advancedAnalytics: true,
    prioritySupport: true,
    bulkUpload: true
  }
};
```

#### **Educator Plan**
```typescript
const EDUCATOR_PLAN = {
  id: 'educator_monthly',
  name: 'Educator Plan',
  description: 'Complete classroom management solution',
  price: 2499, // $24.99/month
  billingInterval: 'month',
  stripeProductId: 'prod_educator_plan',
  stripePriceId: 'price_educator_monthly',
  features: [
    'Unlimited flashcard decks',
    'Classroom management dashboard',
    'Up to 30 student profiles',
    'Bulk CSV upload tools',
    'Detailed student analytics',
    'Curriculum alignment tools',
    'Priority support with education specialist'
  ],
  limits: {
    maxDecks: -1,
    maxChildren: 30, // students
    advancedAnalytics: true,
    prioritySupport: true,
    bulkUpload: true,
    classroomManagement: true
  }
};
```


---

## Stripe Integration Implementation

### Environment Configuration

```typescript
// Environment variables required
interface StripeConfig {
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_CONNECT_CLIENT_ID?: string; // For future marketplace features
}

// Product and Price IDs (set in Stripe Dashboard)
const STRIPE_PRICE_IDS = {
  individual_monthly: 'price_1234567889',
  individual_yearly: 'price_1234567890',
  family_monthly: 'price_1234567891',
  family_yearly: 'price_1234567892',
  educator_monthly: 'price_1234567893',
  educator_yearly: 'price_1234567894'
} as const;
```

### Stripe Client Initialization

```typescript
// Client-side Stripe initialization
import { loadStripe } from '@stripe/stripe-js';

export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Missing Stripe publishable key');
  }
  
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};

// Server-side Stripe initialization
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

### Customer Management

#### **Create Customer (Parent/Teacher Only)**
```typescript
interface CreateCustomerParams {
  email: string;
  name: string;
  role: 'parent' | 'teacher';
  userId: string;
  childrenCount?: number;
}

export async function createStripeCustomer(params: CreateCustomerParams): Promise<string> {
  // COPPA compliance check
  if (params.role === 'child') {
    throw new Error('Cannot create billing accounts for children under 13');
  }
  
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      userId: params.userId,
      role: params.role,
      platform: 'recallforge',
      childrenCount: params.childrenCount?.toString() || '1',
      createdAt: new Date().toISOString()
    },
    // Set up for education sector
    tax_exempt: params.role === 'teacher' ? 'exempt' : 'none'
  });
  
  // Update user record with Stripe customer ID
  await updateUserStripeCustomer(params.userId, customer.id);
  
  return customer.id;
}
```

#### **Customer Portal Integration**
```typescript
export async function createCustomerPortalSession(
  customerId: string, 
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    configuration: {
      business_profile: {
        headline: 'Manage your RecallForge subscription',
      },
      features: {
        payment_method_update: { enabled: true },
        invoice_history: { enabled: true },
        customer_update: {
          enabled: true,
          allowed_updates: ['email', 'name', 'address']
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          proration_behavior: 'none'
        },
        subscription_pause: {
          enabled: false // Don't allow pausing for educational subscriptions
        }
      }
    }
  });
  
  return session.url;
}
```

### Subscription Management

#### **Create Subscription with Trial**
```typescript
interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  childrenCount: number;
  trialDays?: number;
  metadata?: Record<string, string>;
}

export async function createSubscription(
  params: CreateSubscriptionParams
): Promise<Stripe.Subscription> {
  
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: params.customerId,
    items: [{
      price: params.priceId,
      quantity: Math.max(1, params.childrenCount)
    }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
      payment_method_types: ['card']
    },
    expand: ['latest_invoice.payment_intent'],
    trial_period_days: params.trialDays || 14,
    metadata: {
      childrenCount: params.childrenCount.toString(),
      platform: 'recallforge',
      ...params.metadata
    },
    // Automatic tax calculation
    automatic_tax: { enabled: true }
  };
  
  const subscription = await stripe.subscriptions.create(subscriptionParams);
  
  // Store subscription details in database
  await storeSubscriptionDetails({
    userId: await getUserIdByStripeCustomer(params.customerId),
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
  });
  
  return subscription;
}
```

#### **Upgrade/Downgrade Subscription**
```typescript
export async function changeSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string,
  prorationBehavior: 'create_prorations' | 'none' = 'create_prorations'
): Promise<Stripe.Subscription> {
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: prorationBehavior,
    // For educational institutions, we're more lenient with prorations
    billing_cycle_anchor: prorationBehavior === 'none' ? 'unchanged' : undefined
  });
  
  // Update database with new plan details
  await updateUserSubscriptionPlan(
    subscription.metadata.userId,
    mapStripePriceToInternalPlan(newPriceId)
  );
  
  return updatedSubscription;
}
```

### Payment Intent Handling

#### **Create Setup Intent for Payment Method**
```typescript
export async function createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
  return await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session', // For future subscription payments
    metadata: {
      type: 'subscription_setup'
    }
  });
}
```

#### **Process Payment with Error Handling**
```typescript
export async function processSubscriptionPayment(
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Send confirmation email
      await sendPaymentConfirmationEmail(paymentIntent.customer as string);
      
      // Trigger welcome email sequence
      await triggerWelcomeEmailSequence(paymentIntent.customer as string);
      
      return { success: true };
    }
    
    return { 
      success: false, 
      error: `Payment status: ${paymentIntent.status}` 
    };
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return { 
      success: false, 
      error: 'Payment processing failed. Please try again.' 
    };
  }
}
```

---

## Webhook Event Handling

### Webhook Security

```typescript
import { headers } from 'next/headers';

export async function verifyStripeWebhook(
  payload: string,
  signature: string
): Promise<Stripe.Event> {
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing Stripe webhook secret');
  }
  
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}
```

### Event Handlers

#### **Subscription Created**
```typescript
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  // Update user subscription status
  await updateUserSubscription(customer.metadata.userId, {
    subscription_status: mapStripePriceToInternalPlan(subscription.items.data[0].price.id),
    stripe_subscription_id: subscription.id,
    subscription_expires_at: new Date(subscription.current_period_end * 1000),
    trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    subscription_created_at: new Date(subscription.created * 1000)
  });
  
  // Send welcome email
  await sendSubscriptionWelcomeEmail(customer.email!, {
    planName: mapStripePriceToInternalPlan(subscription.items.data[0].price.id),
    trialEndDate: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    nextBillingDate: new Date(subscription.current_period_end * 1000)
  });
  
  // Track analytics event
  await trackSubscriptionEvent('subscription_created', {
    userId: customer.metadata.userId,
    plan: mapStripePriceToInternalPlan(subscription.items.data[0].price.id),
    revenue: subscription.items.data[0].price.unit_amount / 100
  });
}
```

#### **Payment Succeeded**
```typescript
async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  // Record successful payment
  await recordPayment({
    userId: customer.metadata.userId,
    stripeInvoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
    billingPeriodStart: new Date(invoice.period_start * 1000),
    billingPeriodEnd: new Date(invoice.period_end * 1000),
    status: 'paid',
    paidAt: new Date(invoice.status_transitions.paid_at! * 1000)
  });
  
  // Send payment confirmation
  await sendPaymentReceiptEmail(customer.email!, {
    amount: invoice.amount_paid / 100,
    currency: invoice.currency.toUpperCase(),
    invoiceNumber: invoice.number!,
    billingPeriod: {
      start: new Date(invoice.period_start * 1000),
      end: new Date(invoice.period_end * 1000)
    }
  });
  
  // Track for business analytics
  await trackRevenueEvent('payment_succeeded', {
    userId: customer.metadata.userId,
    revenue: invoice.amount_paid / 100,
    currency: invoice.currency
  });
}
```

#### **Payment Failed**
```typescript
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  // Update payment status
  await recordPayment({
    userId: customer.metadata.userId,
    stripeInvoiceId: invoice.id,
    amountPaid: 0,
    currency: invoice.currency,
    status: 'failed',
    billingPeriodStart: new Date(invoice.period_start * 1000),
    billingPeriodEnd: new Date(invoice.period_end * 1000)
  });
  
  // Implement graceful degradation
  await scheduleAccountDowngrade(customer.metadata.userId, {
    gracePeriodDays: 7, // Give families time to update payment
    warningEmails: [1, 3, 7] // Send reminders on days 1, 3, and 7
  });
  
  // Send friendly payment failure email
  await sendPaymentFailureEmail(customer.email!, {
    planName: await getUserPlanName(customer.metadata.userId),
    retryUrl: await generatePaymentRetryUrl(invoice.id),
    supportEmail: 'support@recallforge.com'
  });
}
```

#### **Subscription Canceled**
```typescript
async function handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  // Update user to free plan at period end
  await scheduleSubscriptionDowngrade(customer.metadata.userId, {
    downgradeDate: new Date(subscription.current_period_end * 1000),
    newPlan: 'free_trial',
    reason: 'subscription_canceled'
  });
  
  // Send cancellation confirmation
  await sendCancellationConfirmationEmail(customer.email!, {
    accessUntilDate: new Date(subscription.current_period_end * 1000),
    dataRetentionPeriod: '90 days',
    reactivationUrl: await generateReactivationUrl(customer.metadata.userId)
  });
  
  // Trigger retention email sequence
  await triggerCancellationEmailSequence(customer.metadata.userId);
}
```

---

## COPPA Compliance Implementation

### Child Protection Measures

```typescript
class COPPAPaymentCompliance {
  // Never allow children to be billing customers
  static validateBillingEligibility(userAge: number, role: string): boolean {
    if (role === 'child' || userAge < 13) {
      throw new Error('Billing accounts can only be created for parents and teachers (13+)');
    }
    return true;
  }
  
  // Separate child data from billing data
  static async createChildProfile(parentUserId: string, childData: {
    firstName: string;
    gradeLevel: number;
    birthYear?: number;
  }): Promise<string> {
    
    // Store minimal child data, separate from billing
    const childProfile = await createChildProfile({
      parentId: parentUserId,
      firstName: childData.firstName, // First name only, no full name
      gradeLevel: childData.gradeLevel,
      birthYear: childData.birthYear, // Optional, for age-appropriate content
      // No billing information stored with child profiles
    });
    
    return childProfile.id;
  }
  
  // Data deletion for child accounts
  static async handleChildDataDeletion(childId: string): Promise<void> {
    // Immediate deletion of child learning data
    await deleteChildLearningData(childId);
    
    // Anonymize any remaining references
    await anonymizeChildReferences(childId);
    
    // Update parent's billing to reflect reduced child count
    const parentId = await getParentIdByChild(childId);
    await updateSubscriptionChildCount(parentId);
  }
}
```

### Educational Institution Support

```typescript
interface EducationalBilling {
  // Tax-exempt status for schools
  setupEducationalAccount(institutionData: {
    name: string;
    taxId: string;
    type: 'public_school' | 'private_school' | 'homeschool' | 'district';
    contactEmail: string;
  }): Promise<string>;
  
  // Purchase order support
  createPurchaseOrderBilling(details: {
    poNumber: string;
    institutionId: string;
    approverEmail: string;
    netTerms: number; // e.g., 30 days
  }): Promise<string>;
  
  // Volume discounts
  calculateEducationalDiscount(studentCount: number): {
    discountPercent: number;
    qualifiedPlan: string;
  };
}

const educationalDiscounts = {
  '1-10': { discount: 0, plan: 'educator' },
  '11-50': { discount: 10, plan: 'educator' },
  '51-200': { discount: 20, plan: 'school' },
  '201-1000': { discount: 30, plan: 'district' },
  '1000+': { discount: 40, plan: 'enterprise' }
};
```

---

## Usage-Based Billing for AI Features

### AI Usage Tracking

```typescript
interface AIUsageEvent {
  userId: string;
  operation: 'distractor_generation' | 'categorization' | 'content_analysis';
  tokens: number;
  cost: number; // in cents
  timestamp: Date;
  metadata?: {
    deckId?: string;
    questionCount?: number;
    model?: string;
  };
}

class AIBillingService {
  async trackAIUsage(event: AIUsageEvent): Promise<void> {
    // Store usage event
    await storeAIUsageEvent(event);
    
    // Check if user is approaching limits
    const monthlyUsage = await getMonthlyAIUsage(event.userId);
    const userPlan = await getUserSubscriptionPlan(event.userId);
    const usageLimit = SUBSCRIPTION_PLANS[userPlan].limits.aiUsageLimitCents;
    
    if (monthlyUsage >= usageLimit * 0.8) {
      await sendAIUsageWarningEmail(event.userId, {
        currentUsage: monthlyUsage / 100, // Convert to dollars
        limit: usageLimit / 100,
        percentUsed: (monthlyUsage / usageLimit) * 100
      });
    }
    
    if (monthlyUsage >= usageLimit) {
      await pauseAIFeatures(event.userId);
      await sendAILimitReachedEmail(event.userId);
    }
  }
  
  async generateMonthlyAIBill(userId: string): Promise<AIBillSummary> {
    const usage = await getMonthlyAIUsage(userId);
    const plan = await getUserSubscriptionPlan(userId);
    const includedUsage = SUBSCRIPTION_PLANS[plan].limits.aiUsageLimitCents;
    
    const overage = Math.max(0, usage - includedUsage);
    const overageCost = overage * 0.1; // 10 cents per dollar of overage
    
    return {
      totalUsage: usage,
      includedUsage,
      overage,
      overageCost,
      breakdown: await getAIUsageBreakdown(userId)
    };
  }
}
```

---

## Error Handling and Recovery

### Payment Failure Recovery

```typescript
class PaymentRecoveryService {
  async handleDunningManagement(customerId: string): Promise<void> {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const failedInvoices = await stripe.invoices.list({
      customer: customerId,
      status: 'open'
    });
    
    for (const invoice of failedInvoices.data) {
      // Smart retry logic
      await this.attemptIntelligentRetry(invoice);
    }
  }
  
  private async attemptIntelligentRetry(invoice: Stripe.Invoice): Promise<void> {
    // Try different payment methods on file
    const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card'
    });
    
    for (const pm of paymentMethods.data) {
      try {
        await stripe.invoices.pay(invoice.id, {
          payment_method: pm.id
        });
        
        await sendPaymentSuccessEmail(customer.email!);
        return; // Success!
        
      } catch (error) {
        // Try next payment method
        continue;
      }
    }
    
    // All payment methods failed
    await this.escalatePaymentFailure(customer.id);
  }
  
  private async escalatePaymentFailure(customerId: string): Promise<void> {
    // Implement graceful degradation
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    
    // Move to limited access instead of immediate cutoff
    await downgradeToLimitedAccess(customer.metadata.userId);
    
    // Send helpful email with multiple resolution options
    await sendPaymentResolutionEmail(customer.email!, {
      updatePaymentUrl: await generatePaymentUpdateUrl(customerId),
      contactSupportUrl: 'https://recallforge.com/support',
      faqUrl: 'https://recallforge.com/billing-faq'
    });
  }
}
```

### Subscription State Management

```typescript
interface SubscriptionState {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  accessLevel: 'full' | 'limited' | 'read_only' | 'suspended';
  gracePeriodEnd?: Date;
  features: string[];
}

class SubscriptionStateManager {
  async determineAccessLevel(userId: string): Promise<SubscriptionState> {
    const subscription = await getUserSubscription(userId);
    const paymentStatus = await getLatestPaymentStatus(userId);
    
    // Active subscription
    if (subscription.status === 'active') {
      return {
        status: 'active',
        accessLevel: 'full',
        features: SUBSCRIPTION_PLANS[subscription.plan].features
      };
    }
    
    // Trial period
    if (subscription.status === 'trialing') {
      return {
        status: 'trialing',
        accessLevel: 'full',
        features: SUBSCRIPTION_PLANS[subscription.plan].features
      };
    }
    
    // Payment failed - grace period
    if (subscription.status === 'past_due') {
      const gracePeriodEnd = addDays(subscription.lastPaymentAttempt, 7);
      
      if (new Date() < gracePeriodEnd) {
        return {
          status: 'past_due',
          accessLevel: 'limited',
          gracePeriodEnd,
          features: ['view_progress', 'basic_practice'] // Limited features
        };
      } else {
        return {
          status: 'past_due',
          accessLevel: 'read_only',
          features: ['view_progress'] // Read-only access
        };
      }
    }
    
    // Canceled or unpaid
    return {
      status: subscription.status,
      accessLevel: 'suspended',
      features: []
    };
  }
}
```

---

## Testing and Quality Assurance

### Test Payment Flows

```typescript
// Test customer data for Stripe test mode
const TEST_CUSTOMERS = {
  successful_payment: {
    card: '4242424242424242',
    email: 'test+success@recallforge.com'
  },
  declined_payment: {
    card: '4000000000000002',
    email: 'test+declined@recallforge.com'
  },
  insufficient_funds: {
    card: '4000000000009995',
    email: 'test+insufficient@recallforge.com'
  },
  authentication_required: {
    card: '4000002500003155',
    email: 'test+3ds@recallforge.com'
  }
};

// Automated test suite for payment flows
describe('Payment Integration Tests', () => {
  test('should create subscription with trial', async () => {
    const customer = await createTestCustomer();
    const subscription = await createSubscription({
      customerId: customer.id,
      priceId: STRIPE_PRICE_IDS.family_monthly,
      childrenCount: 2,
      trialDays: 14
    });
    
    expect(subscription.status).toBe('trialing');
    expect(subscription.trial_end).toBeDefined();
  });
  
  test('should handle payment failure gracefully', async () => {
    const customer = await createTestCustomer({
      card: TEST_CUSTOMERS.declined_payment.card
    });
    
    const result = await attemptPayment(customer.id);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('declined');
    
    // Verify graceful degradation was triggered
    const userState = await getUserAccessLevel(customer.metadata.userId);
    expect(userState.accessLevel).toBe('limited');
  });
});
```

### Load Testing Payment System

```typescript
// Artillery.js configuration for payment load testing
const paymentLoadTest = {
  config: {
    target: 'https://api.recallforge.com',
    phases: [
      { duration: 60, arrivalRate: 1 }, // Warm up
      { duration: 300, arrivalRate: 5 }, // Normal payment volume
      { duration: 60, arrivalRate: 20 } // Peak signup periods
    ]
  },
  scenarios: [
    {
      name: 'Subscription Creation Flow',
      weight: 70,
      flow: [
        { post: { url: '/api/customers', json: { email: '{{ email }}', name: '{{ name }}' } } },
        { post: { url: '/api/subscriptions', json: { priceId: 'price_family_monthly' } } },
        { post: { url: '/api/payment-intents/confirm', json: { paymentMethodId: '{{ paymentMethod }}' } } }
      ]
    },
    {
      name: 'Subscription Management',
      weight: 30,
      flow: [
        { get: { url: '/api/customers/{{ customerId }}/subscription' } },
        { post: { url: '/api/customers/{{ customerId }}/portal' } }
      ]
    }
  ]
};
```

---

This comprehensive payment integration specification ensures RecallForge can handle subscription billing safely, compliantly, and at scale while maintaining the child-friendly experience that families expect from educational technology.