-- Add profile_image_url column to portfolio_info table
ALTER TABLE public.portfolio_info 
ADD COLUMN IF NOT EXISTS profile_image_url text default '/images/profile.jpg';

-- Update existing row with profile image
UPDATE public.portfolio_info 
SET profile_image_url = '/images/profile.jpg'
WHERE profile_image_url IS NULL;
