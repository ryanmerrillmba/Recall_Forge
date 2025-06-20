'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTimeBasedGreeting } from '@/lib/utils';

// Mock data - will be replaced with real data from Supabase
const mockChild = {
  id: '1',
  name: 'Lilly',
  grade: 4,
  points: 125,
  streak: 5,
  avatar: '👧'
};

const mockDecks = [
  {
    id: '1',
    name: 'Latin Vocabulary',
    totalQuestions: 25,
    lastScore: 85,
    lastAttemptDate: new Date('2024-01-15'),
    progress: 68,
    category: 'Latin',
    emoji: '📚'
  },
  {
    id: '2',
    name: 'Animals & Plants',
    totalQuestions: 18,
    lastScore: 92,
    lastAttemptDate: new Date('2024-01-14'),
    progress: 82,
    category: 'Science',
    emoji: '🌿'
  },
  {
    id: '3',
    name: 'Family Words',
    totalQuestions: 32,
    lastScore: 78,
    lastAttemptDate: new Date('2024-01-13'),
    progress: 45,
    category: 'Latin',
    emoji: '👨‍👩‍👧‍👦'
  }
];

export default function DashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    // Set greeting on client side to avoid hydration mismatch
    setGreeting(getTimeBasedGreeting());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header 
        variant="app" 
        childName={mockChild.name}
        points={mockChild.points}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-6 animate-bounce-in">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-blue-700 font-medium text-sm">
              {mockChild.streak} day learning streak! 🔥
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-child">
            {greeting}, {mockChild.name}! 🌟
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Ready for today's learning adventure?
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Learning Decks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 font-child">
                My Learning Decks 📚
              </h2>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="btn-primary px-6 py-3 font-child"
              >
                + Add New Deck
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {mockDecks.map((deck) => (
                <Card key={deck.id} className="card-floating p-6 hover:scale-105 transition-all duration-200 cursor-pointer group">
                  <Link href={`/deck/${deck.id}`}>
                    <div className="text-center">
                      <div className="text-4xl mb-4 group-hover:animate-bounce-gentle">
                        {deck.emoji}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2 font-child">
                        {deck.name}
                      </h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="text-sm text-gray-600">
                          {deck.totalQuestions} questions
                        </div>
                        
                        {deck.lastScore && (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm text-gray-600">Last score:</span>
                            <span className="font-bold text-lg text-green-600">
                              {deck.lastScore}%
                            </span>
                            <span className="text-yellow-500">
                              {deck.lastScore >= 90 ? '⭐⭐⭐⭐' : 
                               deck.lastScore >= 80 ? '⭐⭐⭐' :
                               deck.lastScore >= 70 ? '⭐⭐' : '⭐'}
                            </span>
                          </div>
                        )}
                        
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="progress-bar h-3 rounded-full transition-all duration-500"
                            style={{ width: `${deck.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {deck.progress}% mastered
                        </div>
                      </div>
                      
                      <Button className="btn-primary w-full py-3 font-child">
                        Start Practice ✨
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}

              {/* Upload New Deck Card */}
              <Card className="card-floating p-6 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors cursor-pointer group">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="w-full h-full text-center"
                >
                  <div className="text-6xl mb-4 group-hover:animate-bounce-gentle text-blue-400">
                    📤
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-child">
                    Upload New CSV
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Add your flashcards and let our AI create fun practice questions!
                  </p>
                </button>
              </Card>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="card-enhanced p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-child text-center">
                Progress Overview 📊
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 font-child">
                    {mockChild.points.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">total points</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {mockDecks.length}
                    </div>
                    <div className="text-xs text-gray-600">active decks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {mockChild.streak}
                    </div>
                    <div className="text-xs text-gray-600">day streak</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">Recent Activity:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• 5 days practicing</div>
                    <div>• 127 questions answered</div>
                    <div>• 89% average accuracy</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Weekly Challenge */}
            <Card className="card-enhanced p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
              <h3 className="text-lg font-bold text-gray-800 mb-3 font-child text-center">
                🏆 Weekly Challenge
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  4/7
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  days completed this week
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '57%'}}></div>
                </div>
                <p className="text-xs text-gray-600">
                  Practice 3 more days to earn the Weekly Champion badge! 🎖️
                </p>
              </div>
            </Card>

            {/* Parent Dashboard Link */}
            <Card className="card-enhanced p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="text-lg font-bold text-gray-800 mb-3 font-child text-center">
                👨‍👩‍👧‍👦 For Parents
              </h3>
              <div className="space-y-3">
                <Link href="/parent/dashboard">
                  <Button className="btn-secondary w-full py-2 text-sm">
                    View Detailed Reports
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button className="btn-secondary w-full py-2 text-sm">
                    Manage Content
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button className="btn-secondary w-full py-2 text-sm">
                    Account Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-bounce-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-child text-center">
                Upload New Deck 📤
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Upload a CSV file with your flashcards and we'll create engaging practice questions!
              </p>
              
              <div className="space-y-4">
                <Link href="/upload">
                  <Button className="btn-primary w-full py-3 font-child">
                    Choose CSV File ✨
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary w-full py-3 font-child"
                >
                  Maybe Later
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/help/csv-format" className="text-sm text-blue-600 hover:text-blue-700">
                  Need help formatting your CSV? →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer variant="app" />
    </div>
  );
}