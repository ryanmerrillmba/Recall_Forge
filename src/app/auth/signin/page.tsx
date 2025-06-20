'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClientSupabase } from '@/lib/supabase';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const supabase = createClientSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('Invalid login credentials')) {
          setError('Hmm, that email and password don\'t match. Let\'s try again!');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the verification link first!');
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many attempts! Please wait a moment before trying again.');
        } else {
          setError('Something went wrong. Let\'s double-check that email and password!');
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('User signed in successfully:', data.user.id);
        
        // Check if user profile exists
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist - this shouldn't happen if they signed up properly
          console.warn('User profile not found. This user may need to complete signup.');
          setError('Your account setup is incomplete. Please contact support or try signing up again.');
          setIsLoading(false);
          return;
        } else if (profileError) {
          console.error('Error checking user profile:', profileError);
          setError('Something went wrong checking your account. Please try again.');
          setIsLoading(false);
          return;
        }

        console.log('User profile found:', userProfile);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something unexpected went wrong. Please try again!');
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm animate-bounce-in flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Oops! Let's fix this:</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-lg font-bold font-child bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white border-none shadow-xl hover:shadow-2xl hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Getting ready for your adventure!
                </div>
              ) : (
                '✨ Sign In to Your Adventure'
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
              <Button 
                variant="outline"
                className="w-full py-4 text-lg font-semibold font-child border-2 border-green-500 text-green-600 bg-white hover:bg-green-500 hover:text-white hover:border-green-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg focus:ring-4 focus:ring-green-200"
              >
                🚀 Create Your Family Account
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