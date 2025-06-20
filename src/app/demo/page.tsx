import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              See RecallForge in Action! 🎬
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Watch how we transform boring flashcards into engaging learning adventures
            </p>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="card-floating p-8 text-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-16 mb-8">
                <div className="text-white text-8xl mb-6">🎥</div>
                <h3 className="text-2xl font-bold text-white mb-4 font-child">
                  Interactive Demo Coming Soon!
                </h3>
                <p className="text-blue-100 text-lg">
                  We're putting the finishing touches on our interactive demo. 
                  In the meantime, sign up for early access!
                </p>
              </div>
              
              <div className="space-y-4">
                <Link href="/auth/signup">
                  <Button className="btn-primary text-xl px-8 py-4 font-child">
                    Start Free Trial Instead! ✨
                  </Button>
                </Link>
                <div className="text-gray-600">
                  No demo needed - try the real thing for free!
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
              Here's How It Works 🚀
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A sneak peek at the RecallForge experience
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="card-floating p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-child">Upload Your CSV</h3>
                <p className="text-gray-600 leading-relaxed">
                  Drag and drop your flashcard CSV file. Our system automatically detects the question and answer columns.
                </p>
              </Card>

              {/* Step 2 */}
              <Card className="card-floating p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-child">AI Creates Questions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI generates engaging multiple-choice questions with realistic wrong answers designed for young learners.
                </p>
              </Card>

              {/* Step 3 */}
              <Card className="card-floating p-8 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-child">Child Practices & Learns</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your child practices with gamified questions, earns points and badges, while you track their progress.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Interface Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
              Child-Friendly Interface 🌟
            </h2>
            <p className="text-xl text-gray-600">
              Designed specifically for elementary school children
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="card-floating p-8">
              {/* Mock Practice Interface */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-lg font-medium text-gray-700">Question 3 of 10</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-xs">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <span className="text-lg font-medium text-gray-700">⏱️ 08:45</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-lg text-blue-600 mb-2">Latin Vocabulary • Animals & Nature</h3>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 font-child">
                    What does "canis" mean in English?
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <button className="bg-white border-2 border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105">
                    <div className="text-xl font-bold text-gray-800 mb-2">A. dog 🐕</div>
                  </button>
                  <button className="bg-white border-2 border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105">
                    <div className="text-xl font-bold text-gray-800 mb-2">B. cat 🐱</div>
                  </button>
                  <button className="bg-white border-2 border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105">
                    <div className="text-xl font-bold text-gray-800 mb-2">C. horse 🐴</div>
                  </button>
                  <button className="bg-white border-2 border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105">
                    <div className="text-xl font-bold text-gray-800 mb-2">D. bird 🐦</div>
                  </button>
                </div>

                <div className="text-center">
                  <Button className="btn-secondary px-8 py-3 font-child">
                    Skip Question
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-child">
              What Parents Love 💝
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="card-floating text-center p-6">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Real-Time Progress</h4>
              <p className="text-gray-600 text-sm">See exactly what your child is learning and where they need help</p>
            </Card>

            <Card className="card-floating text-center p-6">
              <div className="text-3xl mb-4">🛡️</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">100% Safe</h4>
              <p className="text-gray-600 text-sm">COPPA compliant with no ads, no social features, no data sharing</p>
            </Card>

            <Card className="card-floating text-center p-6">
              <div className="text-3xl mb-4">⏰</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Perfect Sessions</h4>
              <p className="text-gray-600 text-sm">12+ minute average sessions - perfect for child attention spans</p>
            </Card>

            <Card className="card-floating text-center p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Proven Results</h4>
              <p className="text-gray-600 text-sm">85%+ improvement in quiz scores within 4 weeks of use</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 font-child">
            Ready to Try It Yourself? 🚀
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Don't just watch the demo - experience the magic yourself with a free 14-day trial!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-blue-600 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-child">
                Start Free Trial! ✨
              </Button>
            </Link>
            <Link href="/features">
              <Button className="border-2 border-white text-white font-bold text-xl px-10 py-6 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 font-child">
                Learn More 📚
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✅</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✅</span>
              <span>Full access to all features</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✅</span>
              <span>Setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}