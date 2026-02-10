# How to Create Admin Account

Since public sign-up is disabled for security, you need to create your admin account directly through the Supabase database.

## Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at https://supabase.com
2. Navigate to **Authentication** > **Users** in the left sidebar
3. Click **Add user** button
4. Select **Create new user**
5. Enter your email and password
6. Make sure **Auto Confirm User** is checked (so you don't need email verification)
7. Click **Create user**
8. Done! You can now login at `/auth/login` with these credentials

## Method 2: Using SQL (Alternative)

If you prefer using SQL, you can run this script in the Supabase SQL Editor:

```sql
-- Replace with your actual email and password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'your-email@example.com',  -- Change this
  crypt('your-secure-password', gen_salt('bf')),  -- Change this
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**Important Notes:**
- Replace `your-email@example.com` with your actual email
- Replace `your-secure-password` with a strong password
- The password will be automatically hashed using bcrypt

## Access Your Admin Dashboard

Once your account is created, you can:
1. Visit `/auth/login`
2. Enter your email and password
3. You'll be redirected to `/admin` where you can edit your portfolio information

## Security Notes

- Never commit admin credentials to version control
- Use a strong, unique password for your admin account
- Keep your Supabase credentials (API keys) secure
- The admin route is protected by authentication middleware
