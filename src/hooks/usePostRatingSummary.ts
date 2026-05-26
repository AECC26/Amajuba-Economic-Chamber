import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type RatingSummary = {
  avgRating: number | null;
  ratingCount: number;
};

/** Fetches avg rating + count for every slug in one query. */
export function usePostRatingSummaries(slugs: string[]): Record<string, RatingSummary> {
  const [summaries, setSummaries] = useState<Record<string, RatingSummary>>({});

  useEffect(() => {
    if (!supabase || slugs.length === 0) return;

    supabase
      .from('post_ratings')
      .select('slug, rating')
      .in('slug', slugs)
      .then(({ data }) => {
        const rows = (data ?? []) as { slug: string; rating: number }[];
        const map: Record<string, { sum: number; count: number }> = {};

        for (const row of rows) {
          if (!map[row.slug]) map[row.slug] = { sum: 0, count: 0 };
          map[row.slug].sum += row.rating;
          map[row.slug].count += 1;
        }

        const result: Record<string, RatingSummary> = {};
        for (const slug of slugs) {
          const entry = map[slug];
          result[slug] = entry
            ? {
                avgRating: Math.round((entry.sum / entry.count) * 10) / 10,
                ratingCount: entry.count,
              }
            : { avgRating: null, ratingCount: 0 };
        }
        setSummaries(result);
      });
  }, [slugs.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return summaries;
}
