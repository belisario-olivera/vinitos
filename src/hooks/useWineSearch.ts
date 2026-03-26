'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { WineSearchResult } from '@/types/wineCatalog';
import type { ApiResponse } from '@/types/ui';

const DEBOUNCE_MS = 300;

export const useWineSearch = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery<WineSearchResult[]>({
    queryKey: ['wine-search', debouncedQuery],
    queryFn: async () => {
      const params = new URLSearchParams({ q: debouncedQuery });
      const res = await fetch(`/api/wines/search?${params}`);
      const json: ApiResponse<WineSearchResult[]> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60_000,
  });
};
