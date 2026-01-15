
-- Drop existing table to ensure clean state and correct columns
DROP TABLE IF EXISTS public.favorites;

-- Create favorites table with correct columns
CREATE TABLE public.favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  menu_id uuid REFERENCES public.menus(id) NOT NULL, -- Renamed from food_id to menu_id as requested
  food_name text, -- Included for display purposes
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, menu_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- 1. View own favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Insert own favorites
CREATE POLICY "Users can insert their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Delete own favorites
CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);
