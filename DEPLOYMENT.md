# Deployment Guide

This guide will walk you through deploying the Smart Bookmark Manager to Vercel.

## Prerequisites Checklist

- [ ] Supabase project created
- [ ] Database schema applied (see `supabase-schema.sql`)
- [ ] Google OAuth configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

## Step-by-Step Deployment

### 1. Prepare Supabase

1. **Apply Database Schema**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy the contents of `supabase-schema.sql`
   - Run the SQL
   - Verify the `bookmarks` table exists in Table Editor

2. **Configure Google OAuth**
   - Go to Authentication > Providers > Google
   - Enable the Google provider
   - Add your Google OAuth Client ID and Secret
   - Note the callback URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

3. **Get Supabase Credentials**
   - Go to Project Settings > API
   - Copy these values:
     - Project URL
     - Anon/Public key

### 2. Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Add Authorized Redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   https://YOUR_VERCEL_APP.vercel.app/auth/callback
   ```
6. Save and copy Client ID and Client Secret

### 3. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Smart Bookmark Manager"

# Add remote
git remote add origin https://github.com/yourusername/smart-bookmark-app.git

# Push to GitHub
git push -u origin main
```

### 4. Deploy to Vercel

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Before deploying, click "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Get your deployment URL (e.g., `https://your-app.vercel.app`)

### 5. Update OAuth Redirect URLs

1. **Update Supabase Site URL**
   - Go to Supabase > Authentication > URL Configuration
   - Set Site URL to: `https://your-app.vercel.app`
   - Add to Redirect URLs: `https://your-app.vercel.app/**`

2. **Update Google OAuth**
   - Go to Google Cloud Console > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add to Authorized redirect URIs:
     ```
     https://your-app.vercel.app/auth/callback
     ```
   - Save

### 6. Test Deployment

1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Authorize the app
4. Add a bookmark
5. Open in another tab/browser
6. Verify real-time sync works

## Troubleshooting

### "Redirect URI mismatch" Error

- Ensure all redirect URIs are added to Google Console
- Check that URLs match exactly (no trailing slashes)
- Wait a few minutes for Google to propagate changes

### Bookmarks Not Showing

- Check browser console for errors
- Verify environment variables in Vercel
- Confirm RLS policies are set correctly in Supabase
- Check that Realtime is enabled on the table

### Authentication Not Working

- Verify Google OAuth credentials in Supabase
- Check that Site URL in Supabase matches your Vercel URL
- Clear browser cookies and try again

### Real-time Updates Not Working

- Verify the SQL command to enable Realtime was run
- Check browser console for WebSocket errors
- Ensure Supabase project has Realtime enabled (free tier has limits)

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel will automatically deploy
```

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update Google OAuth redirect URIs with new domain
6. Update Supabase Site URL

## Monitoring

- View deployment logs in Vercel dashboard
- Monitor function logs for errors
- Check Supabase logs for database errors
- Use Vercel Analytics (optional) for usage stats

## Environment Variables for Different Environments

For staging/production environments:

```bash
# Production
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key

# Preview/Staging (optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
```

## Success Criteria

- ✅ App loads at Vercel URL
- ✅ Google Sign-In works
- ✅ Can add bookmarks
- ✅ Can delete bookmarks
- ✅ Real-time sync works across tabs
- ✅ Users can only see their own bookmarks
- ✅ Sign out works correctly

---

🎉 Congratulations! Your Smart Bookmark Manager is now live!
