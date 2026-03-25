'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateWineEntryDTO, WineEntry } from '@/types/wine';
import type { ApiResponse } from '@/types/ui';

export const useUpdateWineEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<WineEntry, Error, { id: string; dto: UpdateWineEntryDTO }>({
    mutationFn: async ({ id, dto }) => {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      const json: ApiResponse<WineEntry> = await res.json();
      if (!json.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wine-entries'] });
      queryClient.invalidateQueries({ queryKey: ['wine-entry', data.id] });
      queryClient.invalidateQueries({ queryKey: ['wine-stats'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
