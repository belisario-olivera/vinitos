-- Wine Entries table
CREATE TABLE wine_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  vintage INTEGER,
  producer TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  grapes TEXT[] NOT NULL DEFAULT '{}',
  purchase_date DATE,
  price NUMERIC(10,2),
  location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5),
  tags TEXT[] NOT NULL DEFAULT '{}',
  privacy TEXT NOT NULL DEFAULT 'private' CHECK (privacy IN ('private','shared','public')),
  share_link_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wine_entries_user_id ON wine_entries(user_id);
CREATE INDEX idx_wine_entries_created_at ON wine_entries(created_at DESC);
CREATE INDEX idx_wine_entries_rating ON wine_entries(rating);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wine_entries_updated_at
  BEFORE UPDATE ON wine_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entry_id UUID NOT NULL REFERENCES wine_entries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  producer TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  grapes TEXT[] NOT NULL DEFAULT '{}',
  vintage INTEGER,
  score NUMERIC(3,2) NOT NULL,
  rationale TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recommendations_source_entry ON recommendations(source_entry_id);

-- RLS Policies for wine_entries
ALTER TABLE wine_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON wine_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public entries"
  ON wine_entries FOR SELECT
  USING (privacy = 'public');

CREATE POLICY "Users can insert own entries"
  ON wine_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON wine_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON wine_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for recommendations
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recommendations for own entries"
  ON recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wine_entries
      WHERE wine_entries.id = recommendations.source_entry_id
        AND wine_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert recommendations for own entries"
  ON recommendations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wine_entries
      WHERE wine_entries.id = recommendations.source_entry_id
        AND wine_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete recommendations for own entries"
  ON recommendations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM wine_entries
      WHERE wine_entries.id = recommendations.source_entry_id
        AND wine_entries.user_id = auth.uid()
    )
  );
