'use client';

import { useQuery } from '@tanstack/react-query';
import type { Tag } from '@/types/tag';
import type { ApiResponse } from '@/types/ui';

export const useTags = () => {
  return useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await fetch('/api/tags');
      const json: ApiResponse<Tag[]> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
  });
};
