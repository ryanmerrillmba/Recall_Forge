import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Child Safety First 🛡️
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Built from the ground up with your child's safety and privacy as our top priority
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="card-floating text-center p-8">
                <div className="text-6xl mb-6">🔒</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">COPPA Compliant</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fully compliant with the Children's Online Privacy Protection Act. We collect minimal data and give parents complete control.
                </p>
              </Card>

              <Card className="card-floating text-center p-8">
                <div className="text-6xl mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Parent Controlled</h3>
                <p className="text-gray-600 leading-relaxed">
                  Parents manage all account settings. Children can only access the learning interface under supervision.
                </p>
              </Card>

              <Card className="card-floating text-center p-8">
                <div className="text-6xl mb-6">🚫</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">No Social Features</h3>
                <p className="text-gray-600 leading-relaxed">
                  No chat, no social sharing, no child-to-child communication. Just safe, focused learning.
                </p>
              </Card>
            </div>

            <div className="mt-16 text-center">
              <Link href="/contact">
                <button className="btn-primary text-xl px-8 py-4 font-child">
                  Questions About Safety? Contact Us 💬
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}