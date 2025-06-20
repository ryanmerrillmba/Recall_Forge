import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Help Center 📚
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Find answers, guides, and tips to get the most out of RecallForge
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-child">
              Quick Start Guide 🚀
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="card-floating p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Create Account</h3>
              <p className="text-gray-600 mb-4">Sign up as a parent/guardian and create your child's profile</p>
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Start Here →
              </Link>
            </Card>

            <Card className="card-floating p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Upload CSV</h3>
              <p className="text-gray-600 mb-4">Upload your flashcards and let our AI create practice questions</p>
              <Link href="#csv-format" className="text-blue-600 hover:text-blue-700 font-medium">
                Learn How →
              </Link>
            </Card>

            <Card className="card-floating p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Start Learning</h3>
              <p className="text-gray-600 mb-4">Your child can immediately start practicing with gamified questions</p>
              <Link href="/demo" className="text-blue-600 hover:text-blue-700 font-medium">
                See Demo →
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-child">
              Frequently Asked Questions 💡
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="card-enhanced p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How do I create my first deck?</h4>
                  <p className="text-gray-600">Upload a CSV file with your flashcards using our simple upload tool. Our AI will automatically generate multiple-choice questions from your content.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What age is RecallForge designed for?</h4>
                  <p className="text-gray-600">RecallForge is specifically designed for elementary school children (ages 6-12), with 9-year-olds as our primary target user.</p>
                </div>
              </div>
            </Card>

            <Card className="card-enhanced p-6" id="csv-format">
              <h3 className="text-xl font-bold text-gray-800 mb-4">CSV File Format</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How should I format my CSV file?</h4>
                  <p className="text-gray-600 mb-3">Your CSV should have at least two columns: one for questions and one for answers. Here's an example:</p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    Question,Answer<br/>
                    What does aqua mean?,water<br/>
                    What does casa mean?,house<br/>
                    What does canis mean?,dog
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What file size limits are there?</h4>
                  <p className="text-gray-600">CSV files can be up to 10MB in size. Most flashcard sets will be much smaller than this limit.</p>
                </div>
              </div>
            </Card>

            <Card className="card-enhanced p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Child Safety & Privacy</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Is RecallForge COPPA compliant?</h4>
                  <p className="text-gray-600">Yes! We're fully COPPA compliant. We only collect minimal information (first name and grade level) and parents control all account settings.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Can children create their own accounts?</h4>
                  <p className="text-gray-600">No. All accounts must be created and managed by parents or teachers. Children can only use the learning interface under adult supervision.</p>
                </div>
              </div>
            </Card>

            <Card className="card-enhanced p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Billing & Subscriptions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Is there really a free trial?</h4>
                  <p className="text-gray-600">Yes! You get 14 days completely free with no credit card required. You can access all premium features during your trial.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h4>
                  <p className="text-gray-600">Absolutely! Cancel anytime with no questions asked. No cancellation fees or long-term commitments.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 font-child">
            Still Need Help? 💬
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our friendly support team is here to help you succeed!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/contact">
              <button className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-child">
                Contact Support ✨
              </button>
            </Link>
            <Link href="/community">
              <button className="border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 font-child">
                Join Community 👥
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}