import { DashboardErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import SentryTest from '@/components/ui/SentryTest';

export default function HomePage() {
  return (
    <DashboardErrorBoundary>
      {/* Hero Section with Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-green-200 to-blue-300 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8 animate-bounce-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-blue-700 font-medium text-sm">Built for 9-year-old Lilly & kids who love to learn</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 font-child leading-tight">
              Make Latin Learning Feel Like
              <span className="block text-gradient text-shadow-soft animate-pulse-glow">
                Adventure! 🚀
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto animate-slide-up">
              Transform your CSV flashcards into AI-powered multiple choice tests 
              designed specifically for elementary school students. 
              <span className="block mt-2 text-gradient-primary font-semibold">
                Where learning meets adventure!
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link href="/auth/signup" className="group">
                <button className="btn-primary text-xl px-12 py-6 font-child font-bold shadow-2xl group-hover:shadow-3xl animate-pulse-glow">
                  Start Learning Adventure! ✨
                  <span className="ml-2 group-hover:animate-bounce-gentle">🎯</span>
                </button>
              </Link>
              <Link href="/demo" className="group">
                <button className="btn-secondary text-xl px-10 py-6 font-child font-bold">
                  Watch Demo
                  <span className="ml-2 group-hover:animate-bounce-gentle">🎬</span>
                </button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✅</span>
                <span className="font-medium">Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✅</span>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✅</span>
                <span className="font-medium">COPPA compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Why Children Love RecallForge 
              <span className="text-gradient">🌟</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every feature is designed with child psychology and learning science in mind
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="card-floating text-center p-10 group">
              <div className="text-8xl mb-8 animate-float group-hover:animate-bounce-gentle">🧠</div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 font-child">Smart AI Questions</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our AI creates fun multiple-choice questions from your flashcards. 
                Each question is designed to be challenging but achievable for young learners.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  🎯 Adaptive Learning
                </div>
              </div>
            </div>
            
            <div className="card-floating text-center p-10 group">
              <div className="text-8xl mb-8 animate-float group-hover:animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🎮</div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 font-child">Child-Friendly Design</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Large buttons, encouraging messages, celebration animations, and Comic Neue font 
                make learning feel like playing their favorite game.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  ✨ Magical Interface
                </div>
              </div>
            </div>
            
            <div className="card-floating text-center p-10 group">
              <div className="text-8xl mb-8 animate-float group-hover:animate-bounce-gentle" style={{animationDelay: '1s'}}>🏆</div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 font-child">Achievement System</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Stars, badges, streaks, and points keep children motivated. 
                Every attempt is celebrated with encouraging feedback.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                  🎉 Instant Rewards
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Success Stories That Inspire 
              <span className="text-gradient">📈</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real results from families using RecallForge
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              <div className="card-enhanced p-8 border-l-4 border-green-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    L
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">Lilly, Age 9</h4>
                    <p className="text-gray-600 italic leading-relaxed">
                      "I love getting stars when I answer correctly! Latin words don't seem scary anymore. 
                      It's like playing a game but I'm actually learning!"
                    </p>
                    <div className="flex gap-2 mt-4">
                      <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm text-gray-500">95% improvement</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-enhanced p-8 border-l-4 border-blue-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">Sarah, Parent</h4>
                    <p className="text-gray-600 italic leading-relaxed">
                      "Finally, a learning app that puts my child's safety first. I can see exactly 
                      what Lilly is learning, and she actually asks to practice every day!"
                    </p>
                    <div className="flex gap-2 mt-4">
                      <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm text-gray-500">3 months using</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-floating p-10">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center font-child">
                Proven Results 📊
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Question accuracy improvement</span>
                    <span className="font-bold text-green-600 text-lg">85%+</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="progress-bar w-5/6 h-3"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Average session duration</span>
                    <span className="font-bold text-blue-600 text-lg">12+ min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="progress-bar w-4/5 h-3"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Weekly usage consistency</span>
                    <span className="font-bold text-yellow-600 text-lg">5+ days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="progress-bar w-11/12 h-3"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Parent satisfaction</span>
                    <span className="font-bold text-green-600 text-lg">90%+</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="progress-bar w-full h-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Peace of Mind for Parents 
              <span className="text-gradient">👨‍👩‍👧‍👦</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete control, detailed progress tracking, and COPPA-compliant child safety
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl flex items-center justify-center text-2xl group-hover:animate-bounce-gentle">
                  🛡️
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 font-child">Parent-Controlled Accounts</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You manage everything. Children never have direct access to account settings or personal data. 
                    Full transparency and control over your child's learning experience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl group-hover:animate-bounce-gentle">
                  📊
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 font-child">Detailed Progress Reports</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    See exactly what your child is learning, where they're excelling, and areas that need attention. 
                    Weekly reports delivered to your inbox.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl group-hover:animate-bounce-gentle">
                  🔒
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 font-child">COPPA Compliant</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    We collect minimal child data (first name and grade only) and follow strict privacy guidelines. 
                    Your child's safety is our top priority.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-floating p-10">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center font-child">
                Designed for Success 🎯
              </h3>
              <div className="space-y-6 text-lg">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Question accuracy improvement:</span>
                  <span className="font-bold text-green-600">85%+ in 4 weeks</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Average session duration:</span>
                  <span className="font-bold text-blue-600">12+ minutes</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Weekly usage consistency:</span>
                  <span className="font-bold text-yellow-600">5+ days per week</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Parent satisfaction:</span>
                  <span className="font-bold text-purple-600">90%+ happy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-child animate-bounce-in">
            Ready to Transform Learning? 
            <span className="block text-yellow-300 animate-sparkle">🎓</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed animate-slide-up">
            Join thousands of families making Latin vocabulary mastery feel like an adventure! 
            Start your child's learning journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link href="/auth/signup" className="group">
              <button className="bg-white text-blue-600 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 font-child">
                Start Free Trial Today! 
                <span className="ml-2 group-hover:animate-bounce-gentle">🚀</span>
              </button>
            </Link>
            <Link href="/pricing" className="group">
              <button className="border-2 border-white text-white font-bold text-xl px-10 py-6 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 font-child">
                View Pricing
                <span className="ml-2 group-hover:animate-bounce-gentle">💎</span>
              </button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✅</span>
              <span className="font-medium">No risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✅</span>
              <span className="font-medium">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✅</span>
              <span className="font-medium">Full money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Development: Sentry Test Component */}
      {process.env.NODE_ENV === 'development' && (
        <section className="py-16 bg-gray-100 no-print">
          <div className="container mx-auto px-4">
            <SentryTest />
          </div>
        </section>
      )}
    </DashboardErrorBoundary>
  );
}