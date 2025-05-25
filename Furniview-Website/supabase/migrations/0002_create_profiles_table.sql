-- Create a table for public user profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id bigint primary key generated always as identity,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Foreign key to auth.users
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keep created_at and updated_at columns current
-- Ensure the function is created if it doesn't exist, or handle if it was already created by furniture_models migration
-- For simplicity here, we assume it might need to be created or is idempotent.
CREATE OR REPLACE FUNCTION public.handle_updated_at() -- Changed from trigger_set_timestamp to avoid conflict if you ran that exact name
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- RLS for profiles table (example - to be refined with auth)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile."
ON public.profiles FOR DELETE USING (auth.uid() = user_id); 