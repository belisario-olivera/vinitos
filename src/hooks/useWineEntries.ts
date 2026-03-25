'use client';

import { useQuery } from '@tanstack/react-query';
import type { WineEntry, WineFilters } from '@/types/wine';
import type { ApiResponse } from '@/types/ui';

const buildSearchParams = (filters?: WineFilters): string => {
  const params = new URLSearchParams();
  if (!filters) return '';
  if (filters.search) params.set('search', filters.search);
  if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating));
  if (filters.maxRating !== undefined) params.set('maxRating', String(filters.maxRating));
  if (filters.region) params.set('region', filters.region);
  if (filters.grape) params.set('grape', filters.grape);
  if (filters.sort) params.set('sort', filters.sort);
  const str = params.toString();
  return str ? `?${str}` : '';
};

export const useWineEntries = (filters?: WineFilters) => {
  return useQuery<WineEntry[]>({
    queryKey: ['wine-entries', filters],
    queryFn: async () => {
      const res = await fetch(`/api/entries${buildSearchParams(filters)}`);
      const json: ApiResponse<WineEntry[]> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
  });
};
