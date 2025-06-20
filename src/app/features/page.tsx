import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 lg:py-32">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Features That Make Learning Feel Like 
              <span className="block text-gradient animate-pulse-glow">Magic! ✨</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Every feature is carefully designed with child psychology and learning science in mind
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
              Why Children Love RecallForge 🌟
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="card-floating text-center p-8 group">
              <div className="text-6xl mb-6 animate-float group-hover:animate-bounce-gentle">🧠</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 font-child">Smart AI Questions</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our AI creates fun multiple-choice questions from your flashcards. Each question is designed to be challenging but achievable for young learners.
              </p>
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium inline-block">
                🎯 Adaptive Learning
              </div>
            </Card>

            <Card className="card-floating text-center p-8 group">
              <div className="text-6xl mb-6 animate-float group-hover:animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🎮</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 font-child">Child-Friendly Design</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Large buttons, encouraging messages, celebration animations, and Comic Neue font make learning feel like playing their favorite game.
              </p>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium inline-block">
                ✨ Magical Interface
              </div>
            </Card>

            <Card className="card-floating text-center p-8 group">
              <div className="text-6xl mb-6 animate-float group-hover:animate-bounce-gentle" style={{animationDelay: '1s'}}>🏆</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 font-child">Achievement System</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Stars, badges, streaks, and points keep children motivated. Every attempt is celebrated with encouraging feedback.
              </p>
              <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium inline-block">
                🎉 Instant Rewards
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-16 text-center font-child">
              Complete Learning Experience 🎓
            </h2>

            <div className="space-y-16">
              {/* CSV Upload & AI Processing */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 font-child">📤 Easy CSV Upload</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Simply upload your flashcards as a CSV file and watch our AI transform them into engaging, multiple-choice questions tailored for elementary students.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Drag & drop CSV upload</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Smart column detection</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Real-time processing updates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>AI generates distractors automatically</span>
                    </li>
                  </ul>
                </div>
                <Card className="card-floating p-8 bg-gradient-to-br from-blue-100 to-purple-100">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="font-bold text-lg mb-2">Processing Magic</h4>
                    <p className="text-sm text-gray-600">
                      Our AI reads your flashcards and creates engaging multiple-choice questions with realistic wrong answers to make learning challenging and fun.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Progress Tracking */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="card-floating p-8 bg-gradient-to-br from-green-100 to-yellow-100 order-2 lg:order-1">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <h4 className="font-bold text-lg mb-2">Detailed Analytics</h4>
                    <p className="text-sm text-gray-600">
                      Track progress by topic, see improvement over time, and identify areas that need more practice. Perfect for parents and teachers.
                    </p>
                  </div>
                </Card>
                <div className="order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 font-child">📊 Progress That Parents Love</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Comprehensive analytics help you understand your child's learning journey and celebrate their achievements.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Weekly progress reports</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Topic-by-topic breakdown</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Learning streak tracking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Achievement badge system</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Safety & Privacy */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 font-child">🛡️ Child Safety First</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Built from the ground up with COPPA compliance and child safety as our top priority. Parents control everything.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>COPPA compliant data collection</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Parent-controlled accounts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>No social features or chat</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Minimal data collection</span>
                    </li>
                  </ul>
                </div>
                <Card className="card-floating p-8 bg-gradient-to-br from-red-100 to-pink-100">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h4 className="font-bold text-lg mb-2">Privacy Protected</h4>
                    <p className="text-sm text-gray-600">
                      We only collect first names and grade levels. No photos, addresses, or personal information. Your child's privacy is sacred.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 font-child">
            Ready to Transform Learning? 🚀
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Join thousands of families making vocabulary mastery feel like an adventure!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-blue-600 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-child">
                Start Free Trial! ✨
              </Button>
            </Link>
            <Link href="/demo">
              <Button className="border-2 border-white text-white font-bold text-xl px-10 py-6 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 font-child">
                Watch Demo 🎬
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}