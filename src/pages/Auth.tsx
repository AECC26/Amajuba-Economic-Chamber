import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';

export default function Auth() {
  useSEO({
    title: 'Sign In — Member Portal',
    description: 'Sign in or create an account to access the Amajuba Economic Chamber of Commerce member portal.',
    path: '/auth',
    noIndex: true,
    structuredData: null,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | undefined)?.from ?? '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [from, loading, navigate, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'sign-in') {
        await signIn(email.trim(), password);
        navigate(from, { replace: true });
        return;
      }

      const result = await signUp(email.trim(), password);
      if (result.requiresConfirmation) {
        setMessage('Account created. Please confirm your email before signing in.');
        setMode('sign-in');
        return;
      }

      navigate(from, { replace: true });
    } catch (submitError) {
      const nextError = submitError instanceof Error ? submitError.message : 'Unable to complete the request.';
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-8 py-10 border-b border-slate-100 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Member access</p>
            <h1 className="mt-4 text-3xl font-extrabold">Sign in or create your account</h1>
            <p className="mt-3 text-sm text-slate-200 max-w-xl">
              Access your dashboard, complete the membership application, and manage your profile details in one secure place.
            </p>
          </div>

          <div className="p-8">
            <div className="flex gap-3 mb-8">
              <button
                type="button"
                onClick={() => setMode('sign-in')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'sign-in'
                    ? 'bg-chamber-navy text-white shadow-lg shadow-slate-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('sign-up')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'sign-up'
                    ? 'bg-chamber-navy text-white shadow-lg shadow-slate-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Create account
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                    placeholder="Enter your password"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Use a password with at least 6 characters.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-center">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserRound size={16} className="text-chamber-blue" />
                    <span>
                      {mode === 'sign-in'
                        ? 'Welcome back. Continue your application and update your profile.'
                        : 'Create an account to access your dedicated member dashboard.'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-chamber-navy px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
