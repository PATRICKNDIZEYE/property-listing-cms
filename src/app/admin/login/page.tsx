'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Logo from '@/app/components/layout/header/logo';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use credentials sign-in without redirect and poll the session endpoint
      // until the session is available server-side. This avoids race conditions
      // where the admin layout can't see the session immediately after a
      // client-side redirect and would render without the sidebar.
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
        setLoading(false);
        return;
      }

      // Poll /api/auth/session until the session appears (or timeout)
      const maxAttempts = 10;
      const baseDelay = 300; // ms
      let attempt = 0;
      let session: any = null;

      while (attempt < maxAttempts) {
        const res = await fetch('/api/auth/session');
        try {
          session = await res.json();
        } catch (e) {
          session = null;
        }

        if (session?.user) break;

        // exponential backoff
        await new Promise((r) => setTimeout(r, baseDelay * (attempt + 1)));
        attempt++;
      }

      if (!session?.user) {
        toast.error('Login failed (session not established). Try again.');
        setLoading(false);
        return;
      }

      if (session.user.role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      toast.success('Login successful');

      // Give the auth system a short moment to ensure any cookies are set
      // then navigate to /admin using a full document replace. Using
      // `window.location.replace` guarantees the server receives the
      // cookie/session on the very next request and will render the
      // `AdminLayout` (with sidebar) immediately — avoiding a case where
      // client-side navigation lands on the dashboard content but the
      // server layout hasn't recognized the session yet.
      await new Promise((r) => setTimeout(r, 150));
      if (typeof window !== 'undefined') {
        window.location.replace('/admin');
      } else {
        // Fallback to router replace in non-browser environments
        router.replace('/admin');
      }
    } catch (error) {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light dark:bg-darkmode px-4">
      <div className="max-w-md w-full bg-white dark:bg-semidark p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold mt-4 text-midnight_text dark:text-white">
            Admin Login
          </h1>
          <p className="text-gray dark:text-gray mt-2">
            Sign in to access the admin portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-midnight_text dark:text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-midnight_text dark:text-white mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

