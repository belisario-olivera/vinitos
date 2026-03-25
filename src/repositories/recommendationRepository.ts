import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { RecommendedWine } from '@/types/recommendation';

type RecommendationRow = {
  id: string;
  source_entry_id: string;
  title: string;
  producer: string;
  region: string;
  grapes: string[];
  vintage: number | null;
  score: number;
  rationale: string;
  created_at: string;
};

const mapRowToRecommendation = (row: RecommendationRow): RecommendedWine => ({
  id: row.id,
  title: row.title,
  producer: row.producer,
  region: row.region,
  grapes: row.grapes,
  vintage: row.vintage,
  score: Number(row.score),
  rationale: row.rationale,
});

export const getByEntryId = async (
  client: SupabaseClient,
  entryId: string
): Promise<RecommendedWine[]> => {
  const { data, error } = await client
    .from('recommendations')
    .select('*')
    .eq('source_entry_id', entryId)
    .order('score', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch recommendations: ${error.message}`);
  }

  return (data as RecommendationRow[]).map(mapRowToRecommendation);
};
