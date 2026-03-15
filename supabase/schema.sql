-- Devestock データベーススキーマ
-- Supabase SQL Editorで実行してください

-- 物件テーブル
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  nearest_station TEXT,
  developer TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('tower', 'large_scale', 'mid_scale', 'small_scale', 'low_rise', 'detached', 'mixed_use')),
  grade TEXT NOT NULL CHECK (grade IN ('premium', 'high', 'standard', 'compact')),
  total_units INTEGER,
  floors INTEGER,
  completion_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID -- フェーズ3で外部キー化
);

-- レビューテーブル
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  overall_comment TEXT,
  has_good_ideas BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID -- フェーズ3で外部キー化
);

-- カテゴリ別メモテーブル
CREATE TABLE category_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('exterior', 'entrance', 'common_area', 'corridor', 'floor_plan', 'equipment', 'landscape', 'sales_center')),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 写真テーブル
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_note_id UUID NOT NULL REFERENCES category_notes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_grade ON properties(grade);
CREATE INDEX idx_properties_prefecture ON properties(prefecture);
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_category_notes_review ON category_notes(review_id);
CREATE INDEX idx_category_notes_category ON category_notes(category);
CREATE INDEX idx_photos_note ON photos(category_note_id);

-- updated_at自動更新用トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLSを有効化（フェーズ1では全員許可、フェーズ3で制限）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 一時的にすべてを許可するポリシー
CREATE POLICY "Allow all operations" ON properties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON category_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON photos FOR ALL USING (true) WITH CHECK (true);
