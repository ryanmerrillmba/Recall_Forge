import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />
      
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Start with our free trial and upgrade when you're ready
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Trial</h3>
              <p className="text-4xl font-bold text-blue-600 mb-6">Free</p>
              <p className="text-gray-600 mb-6">14 days</p>
              <Button className="w-full mb-6">Start Free Trial</Button>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✅ 5 flashcard decks</li>
                <li>✅ 1 child profile</li>
                <li>✅ Basic progress tracking</li>
                <li>✅ AI question generation</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Family Plan</h3>
              <p className="text-4xl font-bold text-green-600 mb-6">$19</p>
              <p className="text-gray-600 mb-6">per month</p>
              <Button className="w-full mb-6 bg-green-600 hover:bg-green-700">Choose Family</Button>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✅ Unlimited decks</li>
                <li>✅ Up to 5 children</li>
                <li>✅ Advanced analytics</li>
                <li>✅ Priority support</li>
                <li>✅ Export features</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Educator</h3>
              <p className="text-4xl font-bold text-purple-600 mb-6">$39</p>
              <p className="text-gray-600 mb-6">per month</p>
              <Button className="w-full mb-6 bg-purple-600 hover:bg-purple-700">Choose Educator</Button>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✅ Unlimited decks</li>
                <li>✅ Up to 30 students</li>
                <li>✅ Classroom management</li>
                <li>✅ Bulk operations</li>
                <li>✅ Specialist support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer variant="landing" />
    </div>
  );
}