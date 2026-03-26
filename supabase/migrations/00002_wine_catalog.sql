-- Wine Catalog table (populated by Vivino scraper)
CREATE TABLE wine_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vivino_wine_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  producer TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  grapes TEXT[] NOT NULL DEFAULT '{}',
  average_rating NUMERIC(3,2),
  ratings_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full-text search vector (generated column over name, producer, region)
ALTER TABLE wine_catalog
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(name, '') || ' ' ||
      coalesce(producer, '') || ' ' ||
      coalesce(region, '')
    )
  ) STORED;

CREATE INDEX idx_wine_catalog_search ON wine_catalog USING GIN (search_vector);
CREATE INDEX idx_wine_catalog_ratings_count ON wine_catalog(ratings_count DESC);

-- Reuse the update_updated_at trigger function from initial migration
CREATE TRIGGER wine_catalog_updated_at
  BEFORE UPDATE ON wine_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Prefix-aware full-text search function (used by the search API)
CREATE OR REPLACE FUNCTION search_wine_catalog(
  search_query text,
  result_limit int DEFAULT 10
)
RETURNS SETOF wine_catalog
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM wine_catalog
  WHERE search_vector @@ to_tsquery('simple',
    array_to_string(
      array(
        SELECT word || ':*'
        FROM unnest(string_to_array(trim(search_query), ' ')) AS word
        WHERE word <> ''
      ),
      ' & '
    )
  )
  ORDER BY ratings_count DESC
  LIMIT result_limit;
$$;

-- RLS: authenticated users can read, only service role can write
ALTER TABLE wine_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can search wine catalog"
  ON wine_catalog FOR SELECT
  USING (auth.role() = 'authenticated');
