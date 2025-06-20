import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ParentHelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="app" />
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">Parent Help Center 👨‍👩‍👧‍👦</h1>
          <p className="text-xl text-gray-600">Everything you need to help your child succeed with RecallForge</p>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-floating p-6 text-center">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Upload CSV Files</h3>
              <p className="text-gray-600 mb-4">Learn how to format and upload your flashcards</p>
              <Link href="/help" className="text-blue-600 hover:text-blue-700">Learn More →</Link>
            </Card>
            <Card className="card-floating p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Track Progress</h3>
              <p className="text-gray-600 mb-4">Understand your child's learning analytics</p>
              <Link href="/progress" className="text-blue-600 hover:text-blue-700">Learn More →</Link>
            </Card>
            <Card className="card-floating p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Safety Settings</h3>
              <p className="text-gray-600 mb-4">Manage privacy and safety controls</p>
              <Link href="/safety" className="text-blue-600 hover:text-blue-700">Learn More →</Link>
            </Card>
          </div>
        </div>
      </section>
      <Footer variant="app" />
    </div>
  );
}