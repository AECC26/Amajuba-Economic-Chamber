import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type PostActionsState = {
  likeCount: number;
  liked: boolean;
  userRating: number | null;   // 1–5, null = not rated
  avgRating: number | null;    // null = no ratings yet
  ratingCount: number;
  loading: boolean;
  // actions
  toggleLike: () => Promise<void>;
  submitRating: (stars: number) => Promise<void>;
};

export function usePostActions(slug: string): PostActionsState {
  const { user } = useAuth();

  const [likeCount, setLikeCount]     = useState(0);
  const [liked, setLiked]             = useState(false);
  const [userRating, setUserRating]   = useState<number | null>(null);
  const [avgRating, setAvgRating]     = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading]         = useState(true);

  // ── Fetch current state ──────────────────────────────────────────────────
  const fetchState = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }

    const [likesRes, ratingsRes, userLikeRes, userRatingRes] = await Promise.all([
      // total likes for this post
      supabase
        .from('post_likes')
        .select('id', { count: 'exact', head: true })
        .eq('slug', slug),

      // all ratings for avg calculation
      supabase
        .from('post_ratings')
        .select('rating')
        .eq('slug', slug),

      // did this user like it?
      user
        ? supabase
            .from('post_likes')
            .select('id')
            .eq('slug', slug)
            .eq('user_id', user.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),

      // this user's rating
      user
        ? supabase
            .from('post_ratings')
            .select('rating')
            .eq('slug', slug)
            .eq('user_id', user.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    setLikeCount(likesRes.count ?? 0);
    setLiked(!!userLikeRes.data);
    setUserRating((userRatingRes.data as { rating: number } | null)?.rating ?? null);

    const ratings = (ratingsRes.data ?? []) as { rating: number }[];
    setRatingCount(ratings.length);
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      setAvgRating(Math.round((sum / ratings.length) * 10) / 10);
    } else {
      setAvgRating(null);
    }

    setLoading(false);
  }, [slug, user]);

  useEffect(() => { void fetchState(); }, [fetchState]);

  // ── Toggle like ──────────────────────────────────────────────────────────
  const toggleLike = useCallback(async () => {
    if (!supabase || !user) return;

    // Optimistic update
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    if (liked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('slug', slug)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('post_likes')
        .insert({ slug, user_id: user.id });
    }

    // Re-sync from server
    await fetchState();
  }, [supabase, user, liked, slug, fetchState]);

  // ── Submit / update rating ───────────────────────────────────────────────
  const submitRating = useCallback(async (stars: number) => {
    if (!supabase || !user) return;

    setUserRating(stars);

    if (userRating !== null) {
      // Update existing
      await supabase
        .from('post_ratings')
        .update({ rating: stars, updated_at: new Date().toISOString() })
        .eq('slug', slug)
        .eq('user_id', user.id);
    } else {
      // Insert new
      await supabase
        .from('post_ratings')
        .insert({ slug, user_id: user.id, rating: stars });
    }

    await fetchState();
  }, [supabase, user, userRating, slug, fetchState]);

  return {
    likeCount,
    liked,
    userRating,
    avgRating,
    ratingCount,
    loading,
    toggleLike,
    submitRating,
  };
}
