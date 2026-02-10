# Admin Account Setup

## Creating Your Admin Account

You have two options to create your admin account:

### Option 1: Use the Sign-Up Page (Recommended)

1. Visit `/auth/sign-up` in your browser
2. Create your admin account with your email and password
3. Check your email for a confirmation link (Supabase sends this by default)
4. Confirm your email
5. **IMPORTANT**: After creating your account, delete the sign-up page to prevent others from registering:
   ```bash
   rm -rf app/auth/sign-up
   ```

### Option 2: Use Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Invite User" or "Add User"
4. Enter your email
5. Set a password or send an invite email

## Securing Your Admin Routes

The admin routes (`/admin`) are already protected by middleware. Only authenticated users can access them.

## After Setup

Once you've created your admin account:

1. **Delete the sign-up page** (if you used Option 1)
2. Keep the login page at `/auth/login` for future access
3. You can now access `/admin` to edit your portfolio content

## Managing Your Portfolio

From the admin dashboard (`/admin`), you can:
- Edit your personal information
- Update your bio and tagline
- Modify contact details
- Update social media links
- Change experience stats

All changes are saved directly to your Supabase database.
