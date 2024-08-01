// app/auth/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, FormEvent, useEffect } from 'react';
import SessionProvider from '@/app/components/SessionProvider';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const { data: session, status } = useSession();
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {
      try {
        await axios.post('/api/auth/forgot-password', { email });
        setMessage('A password reset link has been sent to your email');
      } catch (err) {
        setError('An unexpected error occurred');
      }
      return;
    }

    try {
      if (isRegister) {
        await axios.post('/api/register', { email, password, username });
      }
      const res = await signIn('credentials', { email, password, redirect: false });

      if (res?.error) {
        setError('Invalid credentials');
      } else {
        setError(null);
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="flex flex-col bg-gray-900 p-8 rounded-lg">
        {!isForgotPassword && isRegister && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        {!isForgotPassword && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        )}
        <button type="submit" className="p-2 rounded bg-blue-600 text-white mb-2">
          {isForgotPassword ? 'Reset Password' : isRegister ? 'Register' : 'Sign In'}
        </button>
        {!isForgotPassword && (
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)} 
            className="p-2 rounded bg-gray-700 text-white mb-2"
          >
            {isRegister ? 'Already have an account? Sign In' : 'New user? Register'}
          </button>
        )}
        <button 
          type="button" 
          onClick={() => setIsForgotPassword(!isForgotPassword)} 
          className="p-2 rounded bg-gray-700 text-white mb-2"
        >
          {isForgotPassword ? 'Remembered your password? Sign In' : 'Forgot your password?'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default function SignInPage() {
  return (
    <SessionProvider>
      <SignIn />
    </SessionProvider>
  );
}
