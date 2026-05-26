import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Share2, Check, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { usePostActions } from '../hooks/usePostActions';
import { supabase } from '../lib/supabase';

interface Props {
  slug: string;
  title: string;
}

export default function PostActions({ slug, title }: Props) {
  const { user } = useAuth();
  const {
    likeCount, liked, userRating, avgRating, ratingCount,
    loading, toggleLike, submitRating,
  } = usePostActions(slug);

  const [hoverStar, setHoverStar]   = useState(0);
  const [copied, setCopied]         = useState(false);
  const [authNudge, setAuthNudge]   = useState<'like' | 'rate' | null>(null);

  const supabaseReady = !!supabase;

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Auth-gated actions ───────────────────────────────────────────────────
  const handleLike = () => {
    if (!user) { setAuthNudge('like'); return; }
    void toggleLike();
  };

  const handleRate = (stars: number) => {
    if (!user) { setAuthNudge('rate'); return; }
    void submitRating(stars);
  };

  const displayStars = hoverStar || userRating || 0;

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

        {/* ── Like ── */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleLike}
            disabled={loading}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
              liked
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-400'
            } disabled:opacity-50`}
          >
            <Heart
              size={16}
              className={liked ? 'fill-red-500 text-red-500' : ''}
            />
            <span>{likeCount}</span>
          </motion.button>
        </div>

        {/* ── Star rating ── */}
        <div className="flex flex-col gap-1">
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoverStar(0)}
          >
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverStar(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={22}
                  className={`transition-colors ${
                    star <= displayStars
                      ? 'fill-chamber-gold text-chamber-gold'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {/* Rating summary */}
          <p className="text-xs text-slate-400 pl-0.5">
            {userRating
              ? `Your rating: ${userRating} star${userRating > 1 ? 's' : ''}`
              : 'Rate this post'}
            {avgRating !== null && ratingCount > 0 && (
              <span className="ml-2 text-slate-400">
                · avg {avgRating} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
              </span>
            )}
          </p>
        </div>

        {/* ── Share ── */}
        <div className="sm:ml-auto">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => void handleShare()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-chamber-blue hover:text-chamber-blue text-sm font-semibold transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center gap-2 text-green-600"
                >
                  <Check size={15} /> Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="share"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center gap-2"
                >
                  <Share2 size={15} /> Share
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Auth nudge ── */}
      <AnimatePresence>
        {authNudge && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-4 flex items-center gap-3 px-4 py-3 bg-chamber-navy/5 border border-chamber-navy/15 rounded-xl text-sm text-chamber-navy"
          >
            <LogIn size={15} className="shrink-0 text-chamber-blue" />
            <span>
              You need to{' '}
              <Link to="/auth" className="font-semibold underline underline-offset-2 hover:text-chamber-blue">
                sign in
              </Link>{' '}
              to {authNudge === 'like' ? 'like' : 'rate'} this post.
            </span>
            <button
              onClick={() => setAuthNudge(null)}
              className="ml-auto text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Supabase not configured notice ── */}
      {!supabaseReady && (
        <p className="mt-4 text-xs text-slate-400 italic">
          Like and rate features require Supabase to be configured (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY).
        </p>
      )}
    </div>
  );
}
