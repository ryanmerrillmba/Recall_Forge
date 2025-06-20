'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { createClientSupabase } from '@/lib/supabase';
import { Mail, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientSupabase();

  // Check for auth state changes (email verification)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        console.log('Email verified, creating user profile...');
        setIsProcessing(true);
        
        try {
          // Get pending user data from localStorage
          const pendingData = localStorage.getItem('pendingUserData');
          const userData = pendingData ? JSON.parse(pendingData) : {};
          
          // Create user profile in database
          const { error: profileError } = await supabase
            .from('users')
            .upsert([{
              id: session.user.id,
              email: session.user.email,
              role: 'parent',
              subscription_status: 'free',
              email_marketing_consent: userData.email_marketing_consent || false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          } else {
            console.log('User profile created successfully');
          }

          // Create child profile if provided
          if (userData.childName && userData.childGrade) {
            const { error: childError } = await supabase
              .from('child_profiles')
              .insert([{
                parent_id: session.user.id,
                name: userData.childName,
                grade_level: userData.childGrade === 'K' ? 0 : 
                            userData.childGrade === 'homeschool' ? null : 
                            parseInt(userData.childGrade),
                birth_year: null,
                preferences: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);

            if (childError) {
              console.error('Child profile creation error:', childError);
            } else {
              console.log('Child profile created successfully');
            }
          }

          // Clean up localStorage
          localStorage.removeItem('pendingUserData');
          
          // Redirect to dashboard
          router.push('/dashboard');
          
        } catch (error) {
          console.error('Error during profile creation:', error);
          setIsProcessing(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setResendMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setResendMessage('Could not resend email. Please try again.');
      } else {
        setResendMessage('✅ New verification email sent! Check your inbox.');
        setCountdown(60); // 60 second cooldown
      }
    } catch (err) {
      setResendMessage('Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots opacity-30"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-green-200 to-blue-300 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>

      <div className="max-w-2xl mx-auto relative z-10">
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
          <h1 className="text-4xl font-bold text-gray-800 mt-4 font-child animate-slide-up">
            📧 Check Your Email!
          </h1>
          <p className="text-xl text-gray-600 mt-2 animate-slide-up" style={{animationDelay: '0.2s'}}>
            We've sent you a verification link to get started
          </p>
        </div>

        {/* Email Verification Card */}
        <div className="card-enhanced p-8 text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-child">
              Almost There! 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              We sent a verification email to:
            </p>
            <p className="text-lg font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
              {email}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 font-child">
              📝 What to do next:
            </h3>
            <ol className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                Check your email inbox (and spam folder too!)
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                Look for an email from RecallForge
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                Click the "Confirm your account" button
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                Start your learning adventure! 🚀
              </li>
            </ol>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 animate-pulse">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-green-700 font-semibold">
                  🎉 Email verified! Setting up your account...
                </span>
              </div>
            </div>
          )}

          {/* Resend Email */}
          <div className="space-y-4">
            <p className="text-gray-600">
              Didn't receive the email?
            </p>
            
            <Button
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0}
              variant="outline"
              className="px-6 py-3 font-child"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </div>
              ) : countdown > 0 ? (
                `Wait ${countdown}s before resending`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            {resendMessage && (
              <div className={`p-3 rounded-lg text-sm animate-bounce-in ${
                resendMessage.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {resendMessage}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">
              Need help? Check out our setup guide:
            </p>
            <Link href="/help/getting-started">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-child">
                📚 Getting Started Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Having trouble? We're here to help!
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/support">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                💬 Contact Support
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                🔑 Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}