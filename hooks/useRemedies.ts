// hooks/useRemedies.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabase';

export type Remedy = {
  id: string | number;
  name: string;
  description: string | null;
  image: string | null;         // full URL or storage path
  uses: string[] | string | null;
  preparation: string | null;
  dosage: string | null;
  warnings?: string | null;
  created_at?: string;
};

type LoadOpts = { search?: string; from?: number; to?: number };

const PAGE = 30;

export function useRemedies(initialSearch = '') {
  const [items, setItems] = useState<Remedy[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);

  const normalize = (r: Remedy): Remedy & { uses: string[] } => {
    let usesArr: string[] = [];
    if (Array.isArray(r.uses)) usesArr = r.uses.filter(Boolean);
    else if (typeof r.uses === 'string') {
      usesArr = r.uses.split(',').map(s => s.trim()).filter(Boolean);
    }
    return { ...r, uses: usesArr };
  };

  const load = useCallback(
    async ({ search: s = '', from = 0, to = PAGE - 1 }: LoadOpts) => {
      setLoading(true);
      setError(null);
      try {
        let q = supabase.from('remedies').select('*', { count: 'exact' }).order('name', { ascending: true });

        if (s.trim()) {
          // case-insensitive name match (fallback: add OR for description if you want)
          q = q.ilike('name', `%${s.trim()}%`);
        }

        const { data, error: err, count } = await q.range(from, to);
        if (err) throw err;

        const normalized = (data ?? []).map(normalize);
        if (from === 0) setItems(normalized);
        else setItems(prev => [...prev, ...normalized]);

        const total = count ?? 0;
        setHasMore(to + 1 < total);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load remedies');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // initial + debounced search
  useEffect(() => {
    pageRef.current = 0;
    const t = setTimeout(() => load({ search, from: 0, to: PAGE - 1 }), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 0;
    await load({ search, from: 0, to: PAGE - 1 });
  }, [search, load]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    pageRef.current += 1;
    const from = pageRef.current * PAGE;
    const to = from + PAGE - 1;
    await load({ search, from, to });
  }, [hasMore, loading, load, search]);

  // If your images are stored in Supabase Storage and `image` is a path like "remedies/foo.jpg",
  // you can convert it here to public URLs. Uncomment and set your bucket name:
  // const withPublicUrls = useMemo(() => {
  //   return items.map(item => {
  //     if (!item.image || item.image.startsWith('http')) return item;
  //     const { data } = supabase.storage.from('images').getPublicUrl(item.image);
  //     return { ...item, image: data.publicUrl };
  //   });
  // }, [items]);

  return {
    items,                  // or replace with withPublicUrls
    loading,
    refreshing,
    error,
    search,
    setSearch,
    refresh,
    fetchMore,
    hasMore,
  };
}

export default useRemedies;