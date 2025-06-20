'use client';

import { useState } from 'react';
import { createClientSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function TestSupabasePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientSupabase();

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('users').select('*').limit(1);
      
      if (error) {
        setResult(`❌ Database Error: ${error.message}`);
      } else {
        setResult(`✅ Database Connection: OK (Found ${data.length} users)`);
      }
    } catch (err) {
      setResult(`❌ Connection Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setResult('Testing auth...');
    
    try {
      // Test auth service
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`❌ Auth Error: ${error.message}`);
      } else {
        setResult(`✅ Auth Service: OK (Session: ${session ? 'Active' : 'None'})`);
      }
    } catch (err) {
      setResult(`❌ Auth Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setResult('Testing signup...');
    
    try {
      const testEmail = `test.user.${Date.now()}@gmail.com`;
      const testPassword = 'TestPassword123!';
      
      console.log('Attempting signup with:', { testEmail, testPassword });
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      console.log('Signup result:', { data, error });

      if (error) {
        setResult(`❌ Signup Error: ${error.message}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`✅ Signup Test: OK 
        
User ID: ${data.user?.id}
Email: ${data.user?.email}
Confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}
Session: ${data.session ? 'Created' : 'None'}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setResult(`❌ Signup Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="space-x-4">
            <Button onClick={testConnection} disabled={loading}>
              Test Database
            </Button>
            <Button onClick={testAuth} disabled={loading}>
              Test Auth Service
            </Button>
            <Button onClick={testSignup} disabled={loading}>
              Test Signup
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap">{result || 'Click a button to test'}</pre>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2">Environment Check:</h3>
            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}