import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Edit, LoaderCircle, Mail, Save, ShieldCheck, UserRound, X } from 'lucide-react';
import { supabase, supabaseRegistrationsTable } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';

type ProfileForm = {
  first_name: string;
  last_name: string;
  email_address: string;
};

const emptyProfile = (email: string): ProfileForm => ({
  first_name: '',
  last_name: '',
  email_address: email,
});

const statusStyles: Record<string, string> = {
  Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  'Not started': 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Dashboard() {
  useSEO({
    title: 'Member Dashboard',
    description: 'Manage your Amajuba Economic Chamber of Commerce membership profile and track your application status.',
    path: '/dashboard',
    noIndex: true,
    structuredData: null,
  });

  const { user, session, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile(user?.email ?? ''));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Not started');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase || !user?.email) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setMessage('');

      const { data, error: fetchError } = await supabase
        .from(supabaseRegistrationsTable)
        .select('*')
        .eq('email_address', user.email)
        .maybeSingle();

      if (fetchError) {
        setError('Unable to load your profile right now. Please try again.');
        setLoading(false);
        return;
      }

      setStatus(data?.application_status ?? 'Not started');

      if (data) {
        setProfile({
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          email_address: data.email_address ?? user.email,
        });
      } else {
        setProfile(emptyProfile(user.email));
      }

      setLoading(false);
    };

    void loadProfile();
  }, [user]);

  const updateProfileField = (field: keyof ProfileForm, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (!session?.access_token || !user?.email) {
        throw new Error('You must be signed in to update your profile.');
      }

      // Only send the allowed fields to the server endpoint.
      const payload = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email_address: profile.email_address,
      };

      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Server returned ${res.status}`);
      }

      setMessage('Profile details saved successfully.');
      setIsEditMode(false);
    } catch (saveError) {
      const nextError = saveError instanceof Error ? saveError.message : 'Unable to save your profile.';
      setError(nextError);
    } finally {
      setSaving(false);
    }
  };

  const statusColor = statusStyles[status] ?? statusStyles['Not started'];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-chamber-blue">Your member dashboard</p>
              <h1 className="mt-4 text-3xl font-extrabold text-chamber-navy">Manage your profile</h1>
              <p className="mt-3 text-sm text-slate-600">
                Review your application status and update your personal details.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold shrink-0 ${statusColor}`}>
                  {status === 'Approved' ? <ShieldCheck size={16} /> : status === 'Pending' ? <Clock3 size={16} /> : <AlertTriangle size={16} />}
                  {status}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 min-w-0 max-w-full">
                  <Mail size={16} className="text-chamber-blue shrink-0" />
                  <span className="truncate">{user?.email ?? 'Signed out'}</span>
                </span>
              </div>
            </div>

            {status === 'Not started' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-chamber-navy">What you can do</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                    <p>Update editable profile details and keep your contact information current.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                    <p>Track whether your registration is pending, approved, or not yet started.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                    <p>Return to the membership form to complete or revise your application.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-chamber-navy px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Continue registration
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-chamber-navy">Edit profile details</h2>
                <p className="mt-1 text-sm text-slate-500">Update your personal information below.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 shrink-0">
                {status}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {loading ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                <LoaderCircle size={18} className="animate-spin" />
                Loading your profile…
              </div>
            ) : !isEditMode ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">First name</label>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-slate-700">{profile.first_name || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Last name</label>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-slate-700">{profile.last_name || '—'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4">
                      <p className="text-slate-700">{profile.email_address || '—'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Status</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3">
                    {status === 'Approved' ? (
                      <>
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <span className="font-semibold text-emerald-600">Approved</span>
                      </>
                    ) : status === 'Pending' ? (
                      <>
                        <Clock3 size={18} className="text-amber-600" />
                        <span className="font-semibold text-amber-600">Pending</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} className="text-slate-600" />
                        <span className="font-semibold text-slate-600">Not started</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
                    <UserRound size={16} className="text-chamber-blue shrink-0" />
                    <span className="shrink-0">Signed in as</span>
                    <span className="font-semibold text-slate-700 truncate">{user?.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-chamber-navy px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all w-full sm:w-auto"
                  >
                    Edit profile
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">First name</label>
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(event) => updateProfileField('first_name', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Last name</label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(event) => updateProfileField('last_name', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={profile.email_address}
                      onChange={(e) => updateProfileField('email_address', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Status</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3">
                    {status === 'Approved' ? (
                      <>
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <span className="font-semibold text-emerald-600">Approved</span>
                      </>
                    ) : status === 'Pending' ? (
                      <>
                        <Clock3 size={18} className="text-amber-600" />
                        <span className="font-semibold text-amber-600">Pending</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} className="text-slate-600" />
                        <span className="font-semibold text-slate-600">Not started</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
                    <UserRound size={16} className="text-chamber-blue shrink-0" />
                    <span className="shrink-0">Signed in as</span>
                    <span className="font-semibold text-slate-700 truncate">{user?.email}</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                      <X size={16} />
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full bg-chamber-navy px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 transition-all"
                    >
                      {saving ? 'Saving…' : 'Save profile'}
                      <Save size={16} />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
