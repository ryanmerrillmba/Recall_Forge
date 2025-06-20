'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClientSupabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childGrade: '',
    agreeToTerms: false,
    agreeToEmails: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const router = useRouter();
  const supabase = createClientSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords don\'t match. Let\'s try again!');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to our Terms of Service to continue.');
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.parentName,
            role: 'parent',
            email_marketing_consent: formData.agreeToEmails,
            terms_accepted_at: new Date().toISOString(),
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('already registered')) {
          setError('This email is already registered. Try signing in instead!');
        } else if (authError.message.includes('invalid email')) {
          setError('Please enter a valid email address.');
        } else if (authError.message.includes('weak password')) {
          setError('Password is too weak. Please choose a stronger password.');
        } else {
          setError('Something went wrong with your account creation. Let\'s try again!');
        }
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        console.log('User created in Supabase Auth:', authData.user.id);
        
        // Store form data for later use (after email verification)
        localStorage.setItem('pendingUserData', JSON.stringify({
          childName: formData.childName,
          childGrade: formData.childGrade,
          email_marketing_consent: formData.agreeToEmails
        }));

        // Always redirect to email verification since Supabase requires it
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something unexpected went wrong. Please try again!');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-4xl font-bold text-gray-800 mt-4 font-child">Start Your Learning Adventure!</h1>
          <p className="text-xl text-gray-600 mt-2">Create your family account and help your child discover the joy of learning</p>
        </div>

        {/* Sign Up Form */}
        <div className="card-enhanced p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent Information */}
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-child">👨‍👩‍👧‍👦 Parent/Guardian Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name
                  </label>
                  <Input
                    id="parentName"
                    name="parentName"
                    type="text"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Create Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Choose a strong password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Child Information */}
            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-child">👧👦 Your Child's Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                    Child's First Name Only
                  </label>
                  <Input
                    id="childName"
                    name="childName"
                    type="text"
                    value={formData.childName}
                    onChange={handleChange}
                    placeholder="First name only (COPPA compliant)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">We only collect first names for child safety</p>
                </div>

                <div>
                  <label htmlFor="childGrade" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Grade Level
                  </label>
                  <select
                    id="childGrade"
                    name="childGrade"
                    value={formData.childGrade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select grade level</option>
                    <option value="K">Kindergarten</option>
                    <option value="1">1st Grade</option>
                    <option value="2">2nd Grade</option>
                    <option value="3">3rd Grade</option>
                    <option value="4">4th Grade</option>
                    <option value="5">5th Grade</option>
                    <option value="6">6th Grade</option>
                    <option value="homeschool">Homeschool</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Consent and Agreement */}
            <div className="bg-yellow-50 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-child">🛡️ Safety & Privacy Agreement</h3>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</Link>. 
                    I understand that RecallForge is COPPA compliant and I provide parental consent for my child's participation.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToEmails"
                    checked={formData.agreeToEmails}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I'd like to receive weekly tips to help my child learn better, feature updates, and progress reports. (Optional)
                  </span>
                </label>
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
              className="w-full py-4 text-lg font-bold font-child bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white border-none shadow-xl hover:shadow-2xl hover:from-green-600 hover:via-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating your adventure...
                </div>
              ) : (
                '🚀 Start Free Trial - 14 Days!'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">Already have an account?</p>
            <Link href="/auth/signin">
              <Button 
                variant="outline" 
                className="px-8 py-3 text-lg font-semibold font-child border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-500 hover:text-white hover:border-blue-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-200"
              >
                ✨ Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Benefits Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <span className="text-2xl mb-2 block">🎯</span>
            <h4 className="font-bold text-gray-800">Personalized Learning</h4>
            <p className="text-sm text-gray-600">AI-powered questions adapted to your child's level</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <span className="text-2xl mb-2 block">👨‍👩‍👧‍👦</span>
            <h4 className="font-bold text-gray-800">Parent Control</h4>
            <p className="text-sm text-gray-600">You manage everything, your child just learns and has fun</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <span className="text-2xl mb-2 block">🛡️</span>
            <h4 className="font-bold text-gray-800">COPPA Compliant</h4>
            <p className="text-sm text-gray-600">Maximum privacy protection for your child</p>
          </div>
        </div>
      </div>
    </div>
  );
}