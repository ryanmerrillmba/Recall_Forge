'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FooterProps {
  variant?: 'landing' | 'app';
  className?: string;
}

export function Footer({ variant = 'landing', className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    setIsSubscribed(true);
    setEmail('');
  };

  if (variant === 'app') {
    // Simplified footer for the app interface
    return (
      <footer className={cn('bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-200 py-8', className)}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="RecallForge Logo"
                  width={50}
                  height={40}
                  className="object-contain"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur"></div>
              </div>
              <div>
                <div className="font-child font-bold text-lg text-gray-800">
                  RecallForge
                </div>
                <div className="text-sm text-gray-600">
                  © {currentYear} Making learning fun!
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 text-sm">
              <Link href="/parent/help" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-100">
                Help Center
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-100">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-100">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Full landing page footer
  return (
    <footer className={cn('bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden', className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-dots opacity-10"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full blur-3xl opacity-10"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Newsletter Signup Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mb-16 text-center">
          <h3 className="text-3xl font-bold mb-4 font-child">
            Stay Connected with Learning Adventures! 📧
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get weekly tips to boost your child's learning, feature updates, and success stories from other families.
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-white/30"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 hover:scale-105 font-child"
              >
                Subscribe ✨
              </button>
            </form>
          ) : (
            <div className="bg-green-500 text-white px-6 py-4 rounded-2xl max-w-md mx-auto animate-bounce-in">
              <span className="text-2xl mr-2">🎉</span>
              Thanks for subscribing! Your first email is on the way.
            </div>
          )}
          
          <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Learning tips from education experts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>RecallForge feature updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Success stories from families</span>
            </div>
          </div>
          <p className="text-xs text-blue-300 mt-4">No spam • Unsubscribe anytime</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="RecallForge Logo"
                  width={50}
                  height={40}
                  className="object-contain brightness-0 invert"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 blur"></div>
              </div>
              <div>
                <div className="text-2xl font-bold font-child">RecallForge</div>
                <div className="text-sm text-gray-400">Learning Adventures</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              AI-powered flashcards that make learning Latin vocabulary feel like an adventure 
              for elementary school students.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <span className="text-lg">📘</span>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer">
                <span className="text-lg">🐦</span>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                <span className="text-lg">📱</span>
              </div>
            </div>
          </div>
          
          {/* Parents */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-child text-gradient-primary">For Parents 👨‍👩‍👧‍👦</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">🚀</span>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">🛡️</span>
                  Child Safety
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">📊</span>
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">💎</span>
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Teachers */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-child text-gradient-primary">For Teachers 🏫</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/classroom" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">🎓</span>
                  Classroom Tools
                </Link>
              </li>
              <li>
                <Link href="/curriculum" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">📚</span>
                  Curriculum Alignment
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">📈</span>
                  Student Analytics
                </Link>
              </li>
              <li>
                <Link href="/educator-pricing" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">🎯</span>
                  Educator Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-child text-gradient-primary">Support 🤝</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">❓</span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">💬</span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">👥</span>
                  Community
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce-gentle">🟢</span>
                  Service Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-400">
              <div>
                © {currentYear} RecallForge. All rights reserved. 
                <span className="ml-2 text-green-400 font-medium">COPPA compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400 text-xs font-medium">All systems operational</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105">
                Terms of Service
              </Link>
              <Link href="/coppa" className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105">
                COPPA Compliance
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;