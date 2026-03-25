'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateWineEntryDTO, WineEntry } from '@/types/wine';
import type { ApiResponse } from '@/types/ui';

export const useCreateWineEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<WineEntry, Error, CreateWineEntryDTO>({
    mutationFn: async (dto) => {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      const json: ApiResponse<WineEntry> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-entries'] });
      queryClient.invalidateQueries({ queryKey: ['wine-stats'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
