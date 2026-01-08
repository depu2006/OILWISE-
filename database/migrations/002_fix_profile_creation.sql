-- Fix for Registration Data Not Saving to Supabase
-- This creates a database trigger to automatically create profile when user signs up

-- =====================================================
-- SOLUTION 1: Database Trigger (Recommended)
-- Automatically creates profile when auth user is created
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table when new auth user is created
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SOLUTION 2: Disable Email Confirmation (Quick Fix)
-- =====================================================

-- Go to Supabase Dashboard → Authentication → Settings
-- Under "Email Auth", disable "Enable email confirmations"
-- This allows users to sign up without email verification

-- =====================================================
-- SOLUTION 3: Manual Profile Creation (For Testing)
-- =====================================================

-- If you already have an auth user but no profile, run this:
-- Replace the UUID with your actual auth user ID

-- First, find your auth user ID
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Then create profile manually (replace YOUR_USER_ID)
INSERT INTO profiles (id, email, role, first_name, last_name, phone, state, address)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID from above query
  'restaurant@test.com',  -- Your email
  'restaurant',  -- Role
  'Test',  -- First name
  'Restaurant',  -- Last name
  '1234567890',  -- Phone
  'Maharashtra',  -- State
  'Test Address'  -- Address
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Verify profile was created
SELECT id, email, role, first_name, last_name 
FROM profiles 
WHERE email = 'restaurant@test.com';

-- =====================================================
-- SOLUTION 4: Fix RLS Policies (If profiles table exists but inserts fail)
-- =====================================================

-- Check if RLS is blocking inserts
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if profiles table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Count profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- List all profiles
SELECT id, email, role, first_name, last_name, created_at 
FROM profiles 
ORDER BY created_at DESC;
