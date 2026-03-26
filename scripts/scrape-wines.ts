import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const VIVINO_API_URL = 'https://www.vivino.com/api/explore/explore';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const COUNTRIES = [
  'ar', 'fr', 'it', 'es', 'us', 'au', 'cl',
  'de', 'pt', 'nz', 'at', 'za', 'gr', 'hu', 'ge',
];

const MAX_PAGES_PER_COUNTRY = 50;
const PER_PAGE = 100;
const DELAY_MS = 500;

type VintageRecord = {
  vintage: {
    id: number;
    year: number;
    wine: {
      id: number;
      name: string;
      region: {
        name: string;
        country: {
          name: string;
        };
      };
      winery: {
        name: string;
      };
      grapes?: Array<{ name: string }>;
      has_valid_ratings: boolean;
      statistics?: {
        ratings_average: number;
        ratings_count: number;
      };
    };
    statistics?: {
      ratings_average: number;
      ratings_count: number;
    };
    image?: {
      location: string;
    };
  };
};

type ExploreResponse = {
  explore_vintage: {
    records_matched: number;
    records: VintageRecord[];
  };
};

type WineRow = {
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchPage = async (
  countryCode: string,
  page: number
): Promise<ExploreResponse | null> => {
  const params = new URLSearchParams({
    country_code: countryCode,
    currency_code: 'USD',
    min_rating: '1',
    order_by: 'ratings_count',
    order: 'desc',
    page: String(page),
    per_page: String(PER_PAGE),
  });

  const resp = await fetch(`${VIVINO_API_URL}?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (resp.status === 429) {
    console.warn(`  Rate limited on page ${page}, waiting 10s...`);
    await sleep(10_000);
    return fetchPage(countryCode, page);
  }

  if (!resp.ok) {
    console.error(`  HTTP ${resp.status} on page ${page}`);
    return null;
  }

  return resp.json() as Promise<ExploreResponse>;
};

const extractWine = (record: VintageRecord): WineRow | null => {
  const wine = record.vintage?.wine;
  if (!wine?.id || !wine?.name) return null;

  const stats = record.vintage.statistics ?? wine.statistics;
  const grapes = wine.grapes?.map((g) => g.name) ?? [];

  return {
    vivino_wine_id: wine.id,
    name: wine.name,
    producer: wine.winery?.name ?? '',
    region: wine.region?.name ?? '',
    country: wine.region?.country?.name ?? '',
    grapes,
    average_rating: stats?.ratings_average ?? null,
    ratings_count: stats?.ratings_count ?? 0,
    image_url: record.vintage.image?.location
      ? `https:${record.vintage.image.location}`
      : null,
  };
};

const upsertBatch = async (wines: WineRow[]) => {
  const { error } = await supabase.from('wine_catalog').upsert(wines, {
    onConflict: 'vivino_wine_id',
    ignoreDuplicates: false,
  });

  if (error) {
    console.error('  Upsert error:', error.message);
  }
};

const scrapeCountry = async (
  countryCode: string,
  seenIds: Set<number>
): Promise<number> => {
  let inserted = 0;

  for (let page = 1; page <= MAX_PAGES_PER_COUNTRY; page++) {
    const data = await fetchPage(countryCode, page);
    if (!data || data.explore_vintage.records.length === 0) break;

    const batch: WineRow[] = [];
    for (const record of data.explore_vintage.records) {
      const wine = extractWine(record);
      if (!wine || seenIds.has(wine.vivino_wine_id)) continue;
      seenIds.add(wine.vivino_wine_id);
      batch.push(wine);
    }

    if (batch.length > 0) {
      await upsertBatch(batch);
      inserted += batch.length;
    }

    console.log(
      `  [${countryCode.toUpperCase()}] page ${page} — ${batch.length} new wines (${data.explore_vintage.records.length} records)`
    );

    if (data.explore_vintage.records.length < PER_PAGE) break;
    await sleep(DELAY_MS);
  }

  return inserted;
};

const main = async () => {
  console.log('Starting Vivino wine catalog scrape...\n');
  const seenIds = new Set<number>();
  let totalInserted = 0;

  for (const country of COUNTRIES) {
    console.log(`Scraping ${country.toUpperCase()}...`);
    const count = await scrapeCountry(country, seenIds);
    totalInserted += count;
    console.log(`  Done — ${count} wines added\n`);
    await sleep(DELAY_MS);
  }

  console.log(`\nFinished. Total wines upserted: ${totalInserted}`);
  console.log(`Total unique wine IDs seen: ${seenIds.size}`);
};

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
