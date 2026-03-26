import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { createServiceLogger } from '@/lib/logger';
import * as wineCatalogRepo from '@/repositories/wineCatalogRepository';
import type { WineSearchResult } from '@/types/wineCatalog';

const log = createServiceLogger('wineCatalog');

const MAX_RESULTS = 10;
const MIN_QUERY_LENGTH = 2;

export const searchWines = async (
  query: string
): Promise<WineSearchResult[]> => {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const client = await createClient();
  const results = await wineCatalogRepo.searchWines(
    client,
    trimmed,
    MAX_RESULTS
  );

  log.debug({ query: trimmed, resultCount: results.length }, 'Wine catalog search');
  return results;
};
