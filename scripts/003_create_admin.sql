-- Create admin user
-- NOTE: Replace 'your-email@example.com' and 'your-secure-password' with your actual credentials
-- This script should be run manually and the credentials updated before execution

-- This function creates an admin user via Supabase Auth
-- You can also create the admin user directly in Supabase Dashboard under Authentication > Users
-- Or use the sign-up page ONCE and then delete this script

-- To create an admin user, you have 3 options:
-- 1. Go to /auth/sign-up ONCE to create your account, then delete the sign-up page
-- 2. Use Supabase Dashboard: Authentication > Users > Invite User
-- 3. Use this SQL to insert directly (NOT RECOMMENDED - use Dashboard or sign-up page instead)

-- After creating your admin account, you should remove the sign-up page to prevent others from registering
