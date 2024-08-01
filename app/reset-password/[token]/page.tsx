// app/reset-password/[token]/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ResetPassword = ({ params }: { params: { token: string } }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', { token: params.token, password });
      setMessage('Password has been reset');
      router.push('/auth');
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="flex flex-col bg-gray-900 p-8 rounded-lg">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
          className="mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          required
          className="mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <button type="submit" className="p-2 rounded bg-blue-600 text-white mb-2">
          Reset Password
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
