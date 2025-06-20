import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            Join Our Learning Community 👥
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with other parents and educators who are transforming their children's learning experience
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="card-floating text-center p-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Parent Forum</h3>
              <p className="text-gray-600 mb-4">Share tips, ask questions, and support each other</p>
              <div className="text-sm text-blue-600">Coming Soon!</div>
            </Card>

            <Card className="card-floating text-center p-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Resource Library</h3>
              <p className="text-gray-600 mb-4">Access learning guides and educational content</p>
              <div className="text-sm text-blue-600">Coming Soon!</div>
            </Card>

            <Card className="card-floating text-center p-8">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Success Stories</h3>
              <p className="text-gray-600 mb-4">Celebrate learning achievements together</p>
              <div className="text-sm text-blue-600">Coming Soon!</div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signup">
              <button className="btn-primary text-xl px-8 py-4 font-child">
                Join Early Access! ✨
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}