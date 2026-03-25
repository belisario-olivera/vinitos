'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/types/ui';

type WineStats = {
  total: number;
  avgRating: number;
  topGrape: string;
};

export const useWineStats = () => {
  return useQuery<WineStats>({
    queryKey: ['wine-stats'],
    queryFn: async () => {
      const res = await fetch('/api/entries/stats');
      const json: ApiResponse<WineStats> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
  });
};
