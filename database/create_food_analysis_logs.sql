-- Create food_analysis_logs table to store food analysis data from Campaigns page
-- This will be used to calculate state-wise oil consumption for the Policy Dashboard map

CREATE TABLE IF NOT EXISTS food_analysis_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  oil_content DECIMAL NOT NULL,
  food_type TEXT CHECK (food_type IN ('packaged', 'unpackaged', 'estimated')),
  category TEXT,
  serving_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_food_analysis_user ON food_analysis_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_analysis_created ON food_analysis_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_food_analysis_user_created ON food_analysis_logs(user_id, created_at);

-- Add Row Level Security (RLS) policies
ALTER TABLE food_analysis_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own food analysis logs
CREATE POLICY "Users can insert own food analysis"
  ON food_analysis_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own food analysis logs
CREATE POLICY "Users can view own food analysis"
  ON food_analysis_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Policy makers can view all food analysis logs
CREATE POLICY "Policy makers can view all food analysis"
  ON food_analysis_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'policy'
    )
  );

-- Add comment to table
COMMENT ON TABLE food_analysis_logs IS 'Stores food analysis data from the Campaigns page Get to Know feature';
COMMENT ON COLUMN food_analysis_logs.oil_content IS 'Oil content in grams per 100g';
COMMENT ON COLUMN food_analysis_logs.food_type IS 'Type of food: packaged, unpackaged, or estimated';
