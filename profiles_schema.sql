-- ============================================
-- LoveSaver - Profile & Onboarding Schema Update
-- Run this in your Supabase SQL Editor
-- ============================================
-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    partner_name TEXT,
    currency TEXT DEFAULT 'INR',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- 3. Policies
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can view own profile'
) THEN CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can update own profile'
) THEN CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can insert own profile'
) THEN CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT WITH CHECK (auth.uid() = id);
END IF;
END $$;
-- 4. Unified function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.profiles (id, display_name, onboarding_completed)
VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        false
    ) ON CONFLICT (id) DO NOTHING;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 5. Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();