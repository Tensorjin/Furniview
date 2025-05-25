CREATE TABLE IF NOT EXISTS public.furniture_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    model_file_path TEXT NOT NULL,
    image_preview_url TEXT,
    user_id UUID, -- Nullable for now
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_furniture_models_updated_at
BEFORE UPDATE ON public.furniture_models
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE public.furniture_models ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access"
ON public.furniture_models
FOR SELECT
USING (true);

-- Allow anonymous insert access (TEMPORARY - for dev before auth)
CREATE POLICY "Allow anonymous insert access for initial development"
ON public.furniture_models
FOR INSERT
TO anon
WITH CHECK (true); 