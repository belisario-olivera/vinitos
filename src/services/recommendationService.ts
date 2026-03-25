import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { createServiceLogger } from '@/lib/logger';
import * as recommendationRepo from '@/repositories/recommendationRepository';
import type { RecommendedWine } from '@/types/recommendation';

const log = createServiceLogger('recommendation');

export const getSimilarWines = async (
  userId: string,
  entryId: string
): Promise<RecommendedWine[]> => {
  const client = await createClient();

  const { data: entry } = await client
    .from('wine_entries')
    .select('user_id')
    .eq('id', entryId)
    .single();

  if (!entry || entry.user_id !== userId) {
    log.warn({ entryId, userId }, 'Unauthorized recommendation access attempt');
    return [];
  }

  return recommendationRepo.getByEntryId(client, entryId);
};
