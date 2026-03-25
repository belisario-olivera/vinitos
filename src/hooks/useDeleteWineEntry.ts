'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from '@/types/ui';

export const useDeleteWineEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
      const json: ApiResponse<null> = await res.json();
      if (!json.ok) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-entries'] });
      queryClient.invalidateQueries({ queryKey: ['wine-stats'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
