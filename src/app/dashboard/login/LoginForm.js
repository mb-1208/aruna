"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = error.message;
      if (errorMessage === 'Invalid login credentials') {
        errorMessage = 'Incorrect email or password. Please try again.';
      }
      setError(errorMessage);
      setLoading(false);
    } else {
      if (window.location.pathname.startsWith('/dashboard')) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-50/90 border border-red-200/80 rounded-lg p-3.5">
          <p className="text-xs text-red-800 leading-relaxed font-medium">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1.5">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@arunatravelstudio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3.5 py-2.5 border border-[#e2d8cb] rounded-lg shadow-2xs placeholder-[#aba095] focus:outline-none focus:ring-2 focus:ring-[#d18529]/20 focus:border-[#d18529] text-sm text-[#1c1917] bg-[#faf7f3]/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1.5">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3.5 py-2.5 border border-[#e2d8cb] rounded-lg shadow-2xs placeholder-[#aba095] focus:outline-none focus:ring-2 focus:ring-[#d18529]/20 focus:border-[#d18529] text-sm text-[#1c1917] bg-[#faf7f3]/50 transition-colors"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 rounded-lg shadow-xs text-xs font-semibold text-white bg-[#d18529] hover:bg-[#b8701d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d18529] disabled:opacity-50 transition-all duration-200 uppercase tracking-widest cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign in to Dashboard'}
        </button>
      </div>
    </form>
  );
}
