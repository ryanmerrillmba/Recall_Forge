'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TODO: Implement Supabase authentication
    try {
      // Placeholder for auth logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sign in attempt:', { email });
    } catch (err) {
      setError('Let\'s double-check that email and password!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-6 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots opacity-30"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-green-200 to-blue-300 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="RecallForge Logo"
                width={120}
                height={90}
                className="mx-auto"
                priority
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur"></div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 font-child">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Ready to continue your learning adventure?</p>
        </div>

        {/* Sign In Form */}
        <div className="card-enhanced p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Parent/Guardian Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-primary py-4 text-lg font-child"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Getting ready for your adventure!
                </div>
              ) : (
                'Sign In ✨'
              )}
            </Button>

            <div className="text-center">
              <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">New to RecallForge?</p>
            <Link href="/auth/signup">
              <Button className="btn-secondary w-full py-4 text-lg font-child">
                Create Account 🚀
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-green-500">🔒</span>
              <span>Secure & Safe</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-500">🛡️</span>
              <span>COPPA Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-purple-500">👨‍👩‍👧‍👦</span>
              <span>Family Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}