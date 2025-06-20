import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />
      
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child text-center">
            Terms of Service 📋
          </h1>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <Card className="card-enhanced p-12 max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2>Welcome to RecallForge</h2>
              <p>By using RecallForge, you agree to these terms. Our service is designed for families and educators to help children learn.</p>
              
              <h3>Account Requirements</h3>
              <ul>
                <li>Accounts must be created by parents, guardians, or teachers</li>
                <li>Children under 13 cannot create their own accounts</li>
                <li>You are responsible for maintaining account security</li>
              </ul>

              <h3>Acceptable Use</h3>
              <ul>
                <li>Use RecallForge only for educational purposes</li>
                <li>Do not upload inappropriate or harmful content</li>
                <li>Respect the privacy and safety of children</li>
              </ul>

              <h3>Payment Terms</h3>
              <ul>
                <li>Subscriptions are billed monthly or annually</li>
                <li>14-day free trial requires no payment information</li>
                <li>Cancel anytime with no penalties</li>
              </ul>

              <p className="text-sm text-gray-500 mt-8">
                Last updated: January 2024. For questions, contact us at legal@recallforge.com
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}