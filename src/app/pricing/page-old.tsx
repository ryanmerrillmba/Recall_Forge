import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PricingPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: 'Free',
      duration: '14 days',
      description: 'Perfect for trying out RecallForge',
      features: [
        '5 flashcard decks',
        'Basic progress tracking',
        '1 child profile',
        'AI question generation',
        'Web access'
      ],
      cta: 'Start Free Trial',
      popular: false,
      color: 'blue'
    },
    {
      id: 'family',
      name: 'Family Plan',
      price: '$12.99',
      duration: 'month',
      description: 'Most popular for homeschool families',
      features: [
        'Unlimited flashcard decks',
        'Advanced learning analytics',
        'Up to 5 children profiles',
        'Priority customer support',
        'Mobile app access',
        'Export progress reports',
        'Custom learning goals'
      ],
      cta: 'Choose Family Plan',
      popular: true,
      color: 'green'
    },
    {
      id: 'educator',
      name: 'Educator Plan',
      price: '$24.99',
      duration: 'month',
      description: 'Designed for classroom use',
      features: [
        'Unlimited flashcard decks',
        'Classroom management dashboard',
        'Up to 30 student profiles',
        'Bulk CSV upload tools',
        'Detailed student analytics',
        'Curriculum alignment tools',
        'Priority education specialist support',
        'Progress sharing with parents'
      ],
      cta: 'Choose Educator Plan',
      popular: false,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Choose Your Learning Plan 📚
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Perfect for your family's needs with transparent, fair pricing
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-6 py-3">
              <span className="text-green-500 text-xl">✅</span>
              <span className="text-green-700 font-medium">14-day free trial • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`card-floating relative p-8 text-center ${
                  plan.popular 
                    ? 'ring-4 ring-green-500 ring-opacity-50 scale-105' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      MOST POPULAR 🌟
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 font-child">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-800">
                      {plan.price}
                    </span>
                    {plan.price !== 'Free' && (
                      <span className="text-gray-600">/{plan.duration}</span>
                    )}
                  </div>
                  {plan.price === 'Free' && (
                    <div className="text-gray-600 text-sm mt-1">
                      for {plan.duration}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 text-lg mt-0.5">✅</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup">
                  <Button 
                    className={`w-full py-4 text-lg font-child ${
                      plan.popular 
                        ? 'btn-primary shadow-xl' 
                        : 'btn-secondary'
                    }`}
                  >
                    {plan.cta} ✨
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 font-child">
              Why Families Choose RecallForge 💝
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Perfect for Families</h4>
                <p className="text-gray-600 text-sm">
                  Designed specifically for homeschool families and parents who want to boost their child's learning
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🏫</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Educator Approved</h4>
                <p className="text-gray-600 text-sm">
                  Built with input from elementary school teachers and learning specialists
                </p>
              </div>
              
              <div className="text-4xl mb-4">🛡️</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">COPPA Compliant</h4>
                <p className="text-gray-600 text-sm">
                  Your child's safety and privacy are our top priority. No ads, no data sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-child">
              Frequently Asked Questions 🤔
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="card-enhanced p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Absolutely! Cancel anytime with no questions asked. No long-term commitments or cancellation fees.
              </p>
            </Card>

            <Card className="card-enhanced p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Is there really a free trial?
              </h4>
              <p className="text-gray-600">
                Yes! 14 days completely free with no credit card required. Experience all premium features before you decide.
              </p>
            </Card>

            <Card className="card-enhanced p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                How does the AI work?
              </h4>
              <p className="text-gray-600">
                Upload your CSV flashcards and our AI creates engaging multiple-choice questions with realistic wrong answers tailored for elementary students.
              </p>
            </Card>

            <Card className="card-enhanced p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Is my child's data safe?
              </h4>
              <p className="text-gray-600">
                100% COPPA compliant. We only collect first names and grade levels. No photos, addresses, or personal information ever.
              </p>
            </Card>

            <Card className="card-enhanced p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                What subjects work best?
              </h4>
              <p className="text-gray-600">
                RecallForge works great for vocabulary, language learning, science terms, history facts, and any subject with flashcard-style content.
              </p>
            </Card>

            <Card className="card-enhanced p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600">
                Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your purchase.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 font-child">
            Start Your Learning Adventure Today! 🚀
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Join thousands of families who've transformed their children's learning experience
          </p>
          
          <Link href="/auth/signup">
            <Button className="bg-white text-blue-600 font-bold text-2xl px-16 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-child">
              Start Free Trial - No Credit Card! ✨
            </Button>
          </Link>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✅</span>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✅</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✅</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}