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
  const [username, setUsername] = useState<string>(''); // Add username state
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Registration
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
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Sign In'}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Sign In' : 'New user? Register'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <style jsx>{`
        .signin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #2c2f33;
        }
        form {
          display: flex;
          flex-direction: column;
          background-color: #23272a;
          padding: 2rem;
          border-radius: 8px;
        }
        input {
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 4px;
          border: none;
        }
        button {
          padding: 0.5rem;
          border-radius: 4px;
          background-color: #7289da;
          color: white;
          border: none;
          margin-bottom: 0.5rem;
        }
        .error {
          color: red;
          margin-top: 0.5rem;
        }
      `}</style>
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
