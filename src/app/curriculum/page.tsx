import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            Curriculum Alignment 📖
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RecallForge content aligns with elementary education standards and learning objectives
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="card-enhanced p-12 text-center">
            <div className="text-6xl mb-8">🚧</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-child">
              Curriculum Features Coming Soon!
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're working on detailed curriculum alignment features. In the meantime, 
              our platform already supports elementary learning objectives.
            </p>
            
            <div className="space-y-4">
              <Link href="/auth/signup">
                <button className="btn-primary text-xl px-8 py-4 font-child">
                  Start Using RecallForge Today! ✨
                </button>
              </Link>
              <div className="text-gray-600">
                All current features support elementary education goals
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}