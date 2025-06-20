import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ClassroomPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            Classroom Tools for Teachers 🏫
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools designed specifically for elementary school educators
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-floating text-center p-8">
              <div className="text-6xl mb-6">👩‍🏫</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Class Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage up to 30 students with bulk upload tools and class-wide progress tracking.
              </p>
            </Card>

            <Card className="card-floating text-center p-8">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Student Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Detailed insights into each student's learning progress and areas needing attention.
              </p>
            </Card>

            <Card className="card-floating text-center p-8">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Curriculum Aligned</h3>
              <p className="text-gray-600 leading-relaxed">
                Content and assessments designed to support elementary education standards.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/educator-pricing">
              <button className="btn-primary text-xl px-8 py-4 font-child mr-4">
                View Educator Pricing ✨
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-secondary text-xl px-8 py-4 font-child">
                Request Demo 🎬
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}