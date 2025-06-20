import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function EducatorPricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />
      <section className="py-24 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">Educator Pricing 🎓</h1>
          <p className="text-xl text-gray-600">Special pricing for teachers and educational institutions</p>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="card-enhanced p-12 text-center">
            <div className="text-6xl mb-8">👩‍🏫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-child">Special Educator Pricing: $24.99/month</h2>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              <li>✅ Up to 30 student profiles</li>
              <li>✅ Classroom management dashboard</li>
              <li>✅ Bulk CSV upload tools</li>
              <li>✅ Detailed student analytics</li>
              <li>✅ Priority education specialist support</li>
            </ul>
            <Link href="/contact"><button className="btn-primary text-xl px-8 py-4 font-child">Request Educator Demo ✨</button></Link>
          </Card>
        </div>
      </section>
      <Footer variant="landing" />
    </div>
  );
}