import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Making Learning Feel Like 
              <span className="block text-gradient animate-pulse-glow">Adventure! 🚀</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              We're on a mission to transform how elementary school children learn vocabulary, 
              one flashcard at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 font-child">
              Our Story 📖
            </h2>
            
            <div className="text-lg text-gray-600 leading-relaxed space-y-6 mb-12">
              <p>
                RecallForge was born from a simple observation: 9-year-old Lilly was struggling with her Latin vocabulary homework. 
                Traditional flashcards felt boring and repetitive, and she was losing interest in learning.
              </p>
              
              <p>
                We realized that children learn best when they're engaged, excited, and feel like they're playing rather than studying. 
                That's when we decided to combine the power of AI with child psychology to create something magical.
              </p>
              
              <p>
                Today, RecallForge helps thousands of families transform vocabulary learning from a chore into an adventure. 
                Every feature is designed with elementary school children in mind, ensuring safety, engagement, and genuine learning outcomes.
              </p>
            </div>

            <Card className="card-floating p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To make Latin vocabulary mastery feel like an adventure, not a chore, 
                  while keeping children safe and giving parents complete control.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
              What We Believe 💝
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="card-floating text-center p-6">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Child Safety First</h3>
              <p className="text-gray-600 text-sm">
                COPPA compliance isn't just a requirement—it's our foundation. Your child's safety and privacy are sacred.
              </p>
            </Card>

            <Card className="card-floating text-center p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Learning Through Play</h3>
              <p className="text-gray-600 text-sm">
                When learning feels like playing, children naturally want to do more. We gamify education without the addictive mechanics.
              </p>
            </Card>

            <Card className="card-floating text-center p-6">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Parent Control</h3>
              <p className="text-gray-600 text-sm">
                Parents and teachers are the experts on their children. We provide tools that enhance their guidance, not replace it.
              </p>
            </Card>

            <Card className="card-floating text-center p-6">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-child">Real Learning</h3>
              <p className="text-gray-600 text-sm">
                Every feature is backed by learning science. We measure success by actual academic improvement, not just engagement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
              Built by Parents & Educators 👩‍🏫
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our team combines expertise in child psychology, education technology, and software engineering 
              to create the best possible learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="card-floating text-center p-8">
              <div className="text-6xl mb-6">👨‍💻</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-child">Engineering Team</h3>
              <p className="text-gray-600 mb-4">
                Parents who understand the importance of child-safe technology and COPPA compliance.
              </p>
              <div className="text-sm text-blue-600">
                10+ years in EdTech
              </div>
            </Card>

            <Card className="card-floating text-center p-8">
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-child">Education Advisors</h3>
              <p className="text-gray-600 mb-4">
                Elementary school teachers and learning specialists who guide our product decisions.
              </p>
              <div className="text-sm text-blue-600">
                Licensed K-6 educators
              </div>
            </Card>

            <Card className="card-floating text-center p-8">
              <div className="text-6xl mb-6">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-child">Parent Community</h3>
              <p className="text-gray-600 mb-4">
                Homeschool families and parents who test every feature to ensure it works in real life.
              </p>
              <div className="text-sm text-blue-600">
                100+ active families
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
              Making Real Impact 📊
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%+</div>
              <div className="text-gray-600">Average improvement in quiz scores</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">12+</div>
              <div className="text-gray-600">Minutes average session time</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">90%+</div>
              <div className="text-gray-600">Parent satisfaction rate</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">5+</div>
              <div className="text-gray-600">Days per week usage consistency</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              These aren't just numbers—they represent real children who've discovered that learning can be fun, 
              and real parents who've seen their kids ask to practice more.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 font-child">
            Join Our Learning Community! 🌟
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Be part of a community that's transforming how children learn. Start your family's learning adventure today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-blue-600 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-child">
                Start Free Trial! ✨
              </Button>
            </Link>
            <Link href="/community">
              <Button className="border-2 border-white text-white font-bold text-xl px-10 py-6 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 font-child">
                Join Community 💬
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}