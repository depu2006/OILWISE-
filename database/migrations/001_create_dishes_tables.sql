-- =====================================================
-- Restaurant Dish Analysis Feature - Database Schema
-- Migration: 001_create_dishes_tables.sql
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. DISHES TABLE
-- Stores restaurant dish information
-- =====================================================

CREATE TABLE IF NOT EXISTS dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL, -- Array of ingredient names
    oil_ml NUMERIC(6,2) NOT NULL CHECK (oil_ml >= 0 AND oil_ml <= 1000),
    oil_level VARCHAR(20) CHECK (oil_level IN ('low', 'medium', 'high')),
    cuisine_type VARCHAR(100), -- e.g., 'Indian', 'Chinese', 'Italian'
    category VARCHAR(100), -- e.g., 'Appetizer', 'Main Course', 'Dessert'
    price NUMERIC(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
CREATE INDEX idx_dishes_oil_level ON dishes(oil_level);
CREATE INDEX idx_dishes_cuisine_type ON dishes(cuisine_type);
CREATE INDEX idx_dishes_is_active ON dishes(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dishes_updated_at
    BEFORE UPDATE ON dishes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. HEALTHY_OPTIONS TABLE
-- Master list of healthy dish alternatives
-- =====================================================

CREATE TABLE IF NOT EXISTS healthy_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    oil_ml NUMERIC(6,2) NOT NULL CHECK (oil_ml >= 0 AND oil_ml <= 1000),
    benefits TEXT[], -- Array of health benefits
    cuisine_type VARCHAR(100),
    category VARCHAR(100),
    preparation_method VARCHAR(255), -- e.g., 'Grilled', 'Steamed', 'Baked'
    calories_per_serving INTEGER,
    protein_grams NUMERIC(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_healthy_options_oil_ml ON healthy_options(oil_ml);
CREATE INDEX idx_healthy_options_cuisine_type ON healthy_options(cuisine_type);
CREATE INDEX idx_healthy_options_is_active ON healthy_options(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_healthy_options_updated_at
    BEFORE UPDATE ON healthy_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. DISH_ALTERNATIVES TABLE
-- Junction table linking dishes to healthy alternatives
-- =====================================================

CREATE TABLE IF NOT EXISTS dish_alternatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    healthy_option_id UUID NOT NULL REFERENCES healthy_options(id) ON DELETE CASCADE,
    relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
    reason TEXT, -- Why this alternative is recommended
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dish_id, healthy_option_id)
);

-- Create indexes
CREATE INDEX idx_dish_alternatives_dish_id ON dish_alternatives(dish_id);
CREATE INDEX idx_dish_alternatives_healthy_option_id ON dish_alternatives(healthy_option_id);
CREATE INDEX idx_dish_alternatives_relevance_score ON dish_alternatives(relevance_score DESC);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthy_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_alternatives ENABLE ROW LEVEL SECURITY;

-- DISHES TABLE POLICIES
-- Restaurants can only manage their own dishes
CREATE POLICY "Restaurants can view their own dishes"
    ON dishes FOR SELECT
    USING (auth.uid() = restaurant_id);

CREATE POLICY "Restaurants can insert their own dishes"
    ON dishes FOR INSERT
    WITH CHECK (auth.uid() = restaurant_id);

CREATE POLICY "Restaurants can update their own dishes"
    ON dishes FOR UPDATE
    USING (auth.uid() = restaurant_id)
    WITH CHECK (auth.uid() = restaurant_id);

CREATE POLICY "Restaurants can delete their own dishes"
    ON dishes FOR DELETE
    USING (auth.uid() = restaurant_id);

-- Public can view active dishes
CREATE POLICY "Public can view active dishes"
    ON dishes FOR SELECT
    USING (is_active = true);

-- HEALTHY_OPTIONS TABLE POLICIES
-- Public can read healthy options
CREATE POLICY "Public can view active healthy options"
    ON healthy_options FOR SELECT
    USING (is_active = true);

-- Only admins/policy makers can manage healthy options
CREATE POLICY "Policy makers can manage healthy options"
    ON healthy_options FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('policy', 'admin')
        )
    );

-- DISH_ALTERNATIVES TABLE POLICIES
-- Public can read alternatives
CREATE POLICY "Public can view dish alternatives"
    ON dish_alternatives FOR SELECT
    USING (true);

-- System/authenticated users can insert alternatives
CREATE POLICY "Authenticated users can insert alternatives"
    ON dish_alternatives FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- 5. SEED DATA - Sample Healthy Options
-- =====================================================

INSERT INTO healthy_options (name, description, oil_ml, benefits, cuisine_type, category, preparation_method, calories_per_serving, protein_grams) VALUES
    ('Grilled Paneer Tikka', 'Marinated cottage cheese grilled to perfection', 8.0, ARRAY['High protein', 'Low oil', 'Rich in calcium'], 'Indian', 'Appetizer', 'Grilled', 250, 18.5),
    ('Steamed Vegetable Momos', 'Healthy steamed dumplings with mixed vegetables', 5.0, ARRAY['Low calorie', 'High fiber', 'Steamed preparation'], 'Chinese', 'Appetizer', 'Steamed', 180, 6.0),
    ('Baked Vegetable Cutlet', 'Crispy vegetable patties baked instead of fried', 10.0, ARRAY['Low oil', 'High fiber', 'Nutrient rich'], 'Indian', 'Appetizer', 'Baked', 200, 8.0),
    ('Tandoori Chicken', 'Marinated chicken cooked in tandoor with minimal oil', 12.0, ARRAY['High protein', 'Low fat', 'Grilled'], 'Indian', 'Main Course', 'Tandoori', 280, 32.0),
    ('Grilled Fish', 'Fresh fish grilled with herbs and spices', 10.0, ARRAY['Omega-3 rich', 'Low oil', 'Heart healthy'], 'Continental', 'Main Course', 'Grilled', 220, 28.0),
    ('Mixed Vegetable Stew', 'Nutritious vegetable stew with minimal oil', 8.0, ARRAY['High fiber', 'Low calorie', 'Vitamin rich'], 'Indian', 'Main Course', 'Boiled', 150, 5.0),
    ('Quinoa Salad Bowl', 'Protein-rich quinoa with fresh vegetables', 6.0, ARRAY['High protein', 'Gluten-free', 'Low oil'], 'Continental', 'Main Course', 'Raw/Boiled', 280, 12.0),
    ('Baked Samosa', 'Traditional samosa baked instead of deep-fried', 12.0, ARRAY['Lower calories', 'Less oil', 'Crispy texture'], 'Indian', 'Snack', 'Baked', 180, 4.0),
    ('Steamed Idli', 'Soft steamed rice cakes with no oil', 2.0, ARRAY['Zero oil', 'Easy to digest', 'Probiotic'], 'South Indian', 'Breakfast', 'Steamed', 120, 4.0),
    ('Grilled Vegetable Sandwich', 'Whole wheat sandwich with grilled vegetables', 8.0, ARRAY['High fiber', 'Low oil', 'Nutrient dense'], 'Continental', 'Snack', 'Grilled', 220, 8.0)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to calculate oil level based on quantity
CREATE OR REPLACE FUNCTION calculate_oil_level(oil_ml NUMERIC)
RETURNS VARCHAR AS $$
BEGIN
    IF oil_ml < 15 THEN
        RETURN 'low';
    ELSIF oil_ml >= 15 AND oil_ml <= 30 THEN
        RETURN 'medium';
    ELSE
        RETURN 'high';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get healthy alternatives for a dish
CREATE OR REPLACE FUNCTION get_healthy_alternatives(p_dish_id UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    oil_ml NUMERIC,
    benefits TEXT[],
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ho.id,
        ho.name,
        ho.description,
        ho.oil_ml,
        ho.benefits,
        da.relevance_score
    FROM healthy_options ho
    INNER JOIN dish_alternatives da ON ho.id = da.healthy_option_id
    WHERE da.dish_id = p_dish_id
    AND ho.is_active = true
    ORDER BY da.relevance_score DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify tables were created
DO $$
BEGIN
    RAISE NOTICE 'Migration 001_create_dishes_tables.sql completed successfully!';
    RAISE NOTICE 'Created tables: dishes, healthy_options, dish_alternatives';
    RAISE NOTICE 'Seeded % healthy options', (SELECT COUNT(*) FROM healthy_options);
END $$;
