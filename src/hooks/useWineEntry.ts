'use client';

import { useQuery } from '@tanstack/react-query';
import type { WineEntry } from '@/types/wine';
import type { ApiResponse } from '@/types/ui';

export const useWineEntry = (id: string) => {
  return useQuery<WineEntry>({
    queryKey: ['wine-entry', id],
    queryFn: async () => {
      const res = await fetch(`/api/entries/${id}`);
      const json: ApiResponse<WineEntry> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
    enabled: !!id,
  });
};
