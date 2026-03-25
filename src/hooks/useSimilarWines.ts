'use client';

import { useQuery } from '@tanstack/react-query';
import type { SimilarWinesResponse } from '@/types/recommendation';
import type { ApiResponse } from '@/types/ui';

export const useSimilarWines = (entryId: string, enabled = false) => {
  return useQuery<SimilarWinesResponse>({
    queryKey: ['similar-wines', entryId],
    queryFn: async () => {
      const res = await fetch(`/api/entries/${entryId}/similar`);
      const json: ApiResponse<SimilarWinesResponse> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
    enabled: !!entryId && enabled,
  });
};
