import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />
      <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">Student Analytics 📈</h1>
          <p className="text-xl text-gray-600">Detailed insights into learning progress and performance</p>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="card-enhanced p-12 text-center">
            <div className="text-6xl mb-8">📊</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-child">Advanced Analytics Coming Soon!</h2>
            <p className="text-xl text-gray-600 mb-8">We're building comprehensive analytics features for educators and parents.</p>
            <Link href="/progress"><button className="btn-primary text-xl px-8 py-4 font-child">See Current Progress Features ✨</button></Link>
          </Card>
        </div>
      </section>
      <Footer variant="landing" />
    </div>
  );
}