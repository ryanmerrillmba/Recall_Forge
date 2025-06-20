import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            Progress Tracking That Parents Love 📊
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly how your child is progressing with detailed analytics and insights
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="card-floating p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Real-Time Analytics</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✅ Daily practice sessions and time spent</li>
                <li>✅ Question accuracy by topic</li>
                <li>✅ Learning streaks and consistency</li>
                <li>✅ Areas needing more practice</li>
              </ul>
            </Card>

            <Card className="card-floating p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Weekly Reports</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✅ Detailed progress summaries</li>
                <li>✅ Achievement milestones reached</li>
                <li>✅ Personalized learning recommendations</li>
                <li>✅ Email reports to parents</li>
              </ul>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signup">
              <button className="btn-primary text-xl px-8 py-4 font-child">
                Start Tracking Progress! ✨
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}