'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HeaderProps {
  variant?: 'landing' | 'app';
  childName?: string;
  points?: number;
  className?: string;
}

export function Header({ variant = 'landing', childName, points, className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (variant === 'app') {
    return (
      <header className={cn('bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-lg', className)}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20 py-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="RecallForge Logo"
                  width={100}
                  height={75}
                  className="object-contain transition-transform duration-200 group-hover:scale-105"
                  priority
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur"></div>
              </div>
            </Link>
            
            {/* Child Indicator */}
            {childName && (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-2xl shadow-md animate-bounce-in">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                  <span className="text-white font-bold text-lg font-child">
                    {childName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 font-child text-lg">
                    {childName}
                  </span>
                  <div className="text-xs text-gray-500">Learning Hero</div>
                </div>
              </div>
            )}
            
            {/* Points Display */}
            {points !== undefined && (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-6 py-3 rounded-2xl shadow-xl animate-pulse-glow">
                <span className="text-2xl animate-bounce-gentle">🏆</span>
                <div className="text-center">
                  <div className="font-bold text-xl font-child">
                    {points.toLocaleString()}
                  </div>
                  <div className="text-xs opacity-90">points</div>
                </div>
              </div>
            )}
            
            {/* Settings */}
            <button className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 group">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Landing page header
  return (
    <header className={cn('bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-lg', className)}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="RecallForge Logo"
                width={140}
                height={50}
                className="object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur"></div>
            </div>
            <div className="hidden sm:block">
              <div className="font-child font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RecallForge
              </div>
              <div className="text-xs text-gray-500 -mt-1">Learning Adventures</div>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50">
              Contact
            </Link>
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin">
              <button className="btn-secondary px-6 py-3 text-base font-child">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="btn-primary px-6 py-3 text-base font-child">
                Get Started ✨
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl animate-slide-up">
            <div className="container mx-auto px-6 py-6">
              <nav className="space-y-4 mb-6">
                <Link 
                  href="/features" 
                  className="block text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/pricing" 
                  className="block text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/about" 
                  className="block text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="block text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
              
              <div className="space-y-3">
                <Link href="/auth/signin" className="block">
                  <button 
                    className="w-full btn-secondary py-3 font-child"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <button 
                    className="w-full btn-primary py-3 font-child"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started ✨
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;