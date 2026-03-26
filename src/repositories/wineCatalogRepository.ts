import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { WineSearchResult } from '@/types/wineCatalog';

type WineCatalogRow = {
  id: string;
  vivino_wine_id: number;
  name: string;
  producer: string;
  region: string;
  country: string;
  grapes: string[];
  average_rating: number | null;
  ratings_count: number;
  image_url: string | null;
};

const mapRowToSearchResult = (row: WineCatalogRow): WineSearchResult => ({
  id: row.id,
  vivinoWineId: row.vivino_wine_id,
  name: row.name,
  producer: row.producer,
  region: row.region,
  country: row.country,
  grapes: row.grapes,
  averageRating: row.average_rating ? Number(row.average_rating) : null,
  ratingsCount: row.ratings_count,
  imageUrl: row.image_url,
});

export const searchWines = async (
  client: SupabaseClient,
  query: string,
  limit: number = 10
): Promise<WineSearchResult[]> => {
  const { data, error } = await client.rpc('search_wine_catalog', {
    search_query: query,
    result_limit: limit,
  });

  if (error) {
    throw new Error(`Failed to search wine catalog: ${error.message}`);
  }

  return (data as WineCatalogRow[]).map(mapRowToSearchResult);
};
